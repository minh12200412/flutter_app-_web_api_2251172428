const db = require("../config/db");
const ApiError = require("../utils/apiError");
const { formatYMD, generateOrderNumber } = require("../utils/orderNumber");
const ordersRepo = require("../repositories/orders.repo");
const orderItemsRepo = require("../repositories/orderItems.repo");

function isAdmin(email) {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return admins.includes(email);
}

async function createOrder(customer, payload) {
  const SHIPPING_FEE = Number(process.env.SHIPPING_FEE || 30000);

  // gộp items cùng product_id (tránh trừ stock 2 lần)
  const merged = new Map();
  for (const it of payload.items) {
    merged.set(it.product_id, (merged.get(it.product_id) || 0) + it.quantity);
  }
  const items = Array.from(merged.entries()).map(([product_id, quantity]) => ({
    product_id,
    quantity,
  }));
  const ids = items.map((i) => i.product_id);

  return db.transaction(async (trx) => {
    // lock products để tránh race
    const products = await trx("products").whereIn("id", ids).forUpdate();
    if (products.length !== ids.length)
      throw new ApiError(400, "Some products not found");

    const pMap = new Map(products.map((p) => [p.id, p]));

    // check available + stock
    let subtotal = 0;
    for (const it of items) {
      const p = pMap.get(it.product_id);
      if (!p.is_available)
        throw new ApiError(400, `Product ${it.product_id} is not available`);
      if (Number(p.stock) < it.quantity)
        throw new ApiError(
          400,
          `Not enough stock for product ${it.product_id}`
        );
      subtotal += Number(p.price) * it.quantity;
    }

    const total = subtotal + SHIPPING_FEE;
    const ymd = formatYMD(new Date());
    const order_number = await generateOrderNumber(trx, ymd);

    const [order] = await ordersRepo.create(trx, {
      customer_id: customer.id,
      order_number,
      subtotal,
      shipping_fee: SHIPPING_FEE,
      total,
      order_date: new Date(),
      shipping_address: payload.shipping_address,
      status: "pending",
      payment_method: payload.payment_method || null,
      payment_status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    });

    const orderItems = items.map((it) => {
      const p = pMap.get(it.product_id);
      return {
        order_id: order.id,
        product_id: it.product_id,
        quantity: it.quantity,
        price: p.price,
        created_at: new Date(),
      };
    });

    await orderItemsRepo.createMany(trx, orderItems);

    // trừ stock
    for (const it of items) {
      await trx("products")
        .where({ id: it.product_id })
        .update({
          stock: trx.raw("stock - ?", [it.quantity]),
          updated_at: new Date(),
        });
    }

    return order;
  });
}

async function getOrderById(requester, id) {
  const order = await db("orders").where({ id }).first();
  if (!order) throw new ApiError(404, "Order not found");

  const admin = isAdmin(requester.email);
  if (!admin && order.customer_id !== requester.id)
    throw new ApiError(403, "Forbidden");

  const items = await orderItemsRepo.listByOrderIdWithProduct(id);
  return { ...order, items };
}

async function listCustomerOrders(requester, customerId, query) {
  const admin = isAdmin(requester.email);
  if (!admin && requester.id !== customerId)
    throw new ApiError(403, "Forbidden");

  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 10)));
  const offset = (page - 1) * limit;

  const base = db("orders").where("customer_id", customerId);
  if (query.status) base.andWhere("status", query.status);

  const countRow = await base
    .clone()
    .clearSelect()
    .clearOrder()
    .count("* as total")
    .first();
  const total = Number(countRow?.total || 0);

  const orders = await base
    .clone()
    .select("*")
    .orderBy("id", "desc")
    .limit(limit)
    .offset(offset);

  // include items
  const orderIds = orders.map((o) => o.id);
  const items = orderIds.length
    ? await db("order_items as oi")
        .join("products as p", "p.id", "oi.product_id")
        .whereIn("oi.order_id", orderIds)
        .select(
          "oi.order_id",
          "oi.product_id",
          "oi.quantity",
          "oi.price",
          "p.name as product_name",
          "p.category as product_category",
          "p.brand as product_brand",
          "p.image_url as product_image_url"
        )
    : [];

  const byOrder = new Map();
  for (const it of items) {
    if (!byOrder.has(it.order_id)) byOrder.set(it.order_id, []);
    byOrder.get(it.order_id).push(it);
  }

  const result = orders.map((o) => ({ ...o, items: byOrder.get(o.id) || [] }));

  return { items: result, pagination: { page, limit, total } };
}

async function updateOrderStatus(requester, id, status) {
  const admin = isAdmin(requester.email);

  const order = await db("orders").where({ id }).first();
  if (!order) throw new ApiError(404, "Order not found");

  // quyền:
  // - status = cancelled: admin hoặc chính customer
  // - status khác: chỉ admin
  if (status === "cancelled") {
    if (!admin && order.customer_id !== requester.id)
      throw new ApiError(403, "Forbidden");
  } else {
    if (!admin) throw new ApiError(403, "Forbidden");
  }

  // nếu đã cancelled rồi mà cancel nữa -> 400
  if (order.status === "cancelled" && status === "cancelled") {
    throw new ApiError(400, "Order already cancelled");
  }

  return db.transaction(async (trx) => {
    if (status === "cancelled") {
      // tăng stock lại theo order_items
      const items = await trx("order_items")
        .where({ order_id: id })
        .select("product_id", "quantity");
      // lock products
      const ids = items.map((i) => i.product_id);
      if (ids.length) await trx("products").whereIn("id", ids).forUpdate();

      for (const it of items) {
        await trx("products")
          .where({ id: it.product_id })
          .update({
            stock: trx.raw("stock + ?", [it.quantity]),
            updated_at: new Date(),
          });
      }
    }

    const [updated] = await ordersRepo.updateById(trx, id, {
      status,
      updated_at: new Date(),
    });
    return updated;
  });
}

async function payOrder(requester, id, payment_method) {
  const admin = isAdmin(requester.email);

  const order = await db("orders").where({ id }).first();
  if (!order) throw new ApiError(404, "Order not found");

  if (!admin && order.customer_id !== requester.id)
    throw new ApiError(403, "Forbidden");
  if (order.payment_status === "paid")
    throw new ApiError(400, "Order already paid");
  if (order.status === "cancelled")
    throw new ApiError(400, "Cannot pay a cancelled order");

  // giả lập validate card: chỉ cần chấp nhận method=card là ok (đề nói giả lập)
  const [updated] = await db("orders")
    .where({ id })
    .update({ payment_method, payment_status: "paid", updated_at: new Date() })
    .returning("*");

  return updated;
}

async function listOrdersByStatusAdmin(requester, status) {
  if (!isAdmin(requester.email)) throw new ApiError(403, "Forbidden");
  const qb = db("orders").select("*").orderBy("id", "desc");
  if (status) qb.where("status", status);
  return qb;
}

module.exports = {
  createOrder,
  getOrderById,
  listCustomerOrders,
  updateOrderStatus,
  payOrder,
  listOrdersByStatusAdmin,
};
