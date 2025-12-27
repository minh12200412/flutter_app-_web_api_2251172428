const db = require("../config/db");
const ApiError = require("../utils/apiError");

function buildProductsQuery(qb, query) {
  const { search, category, min_price, max_price, available_only } = query;

  if (search) {
    const s = `%${search}%`;
    qb.andWhere((w) => {
      w.whereILike("name", s)
        .orWhereILike("description", s)
        .orWhereILike("brand", s);
    });
  }

  if (category) qb.andWhere("category", category);
  if (min_price !== undefined) qb.andWhere("price", ">=", Number(min_price));
  if (max_price !== undefined) qb.andWhere("price", "<=", Number(max_price));

  if (String(available_only).toLowerCase() === "true") {
    qb.andWhere("is_available", true).andWhere("stock", ">", 0);
  }
}

async function listProducts(query) {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 10)));
  const offset = (page - 1) * limit;

  const base = db("products");
  buildProductsQuery(base, query);

  const countQuery = base
    .clone()
    .clearSelect()
    .clearOrder()
    .count("* as total")
    .first();
  const dataQuery = base
    .clone()
    .select(
      "id",
      "name",
      "description",
      "price",
      "category",
      "brand",
      "stock",
      "image_url",
      "rating",
      "review_count",
      "is_available",
      "created_at",
      "updated_at"
    )
    .orderBy("id", "desc")
    .limit(limit)
    .offset(offset);

  const [countRow, items] = await Promise.all([countQuery, dataQuery]);
  const total = Number(countRow?.total || 0);

  return { items, pagination: { page, limit, total } };
}

async function getProductById(id) {
  const p = await db("products").where({ id }).first();
  if (!p) throw new ApiError(404, "Product not found");
  return p;
}

// Rule xóa: nếu product có trong order_items mà đơn hàng CHƯA delivered => 400
async function canDeleteProduct(productId) {
  const row = await db("order_items as oi")
    .join("orders as o", "o.id", "oi.order_id")
    .where("oi.product_id", productId)
    .andWhereNot("o.status", "delivered")
    .first("oi.id");

  return !row; // true nếu KHÔNG vướng
}

module.exports = { listProducts, getProductById, canDeleteProduct };
