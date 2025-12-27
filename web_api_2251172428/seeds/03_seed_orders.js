exports.seed = async (knex) => {
  const SHIPPING_FEE = 30000;

  const ordersData = [
    {
      customer_id: 2,
      items: [
        { product_id: 1, quantity: 1 },
        { product_id: 4, quantity: 2 },
      ],
    },
    { customer_id: 3, items: [{ product_id: 2, quantity: 1 }] },
    {
      customer_id: 4,
      items: [
        { product_id: 6, quantity: 1 },
        { product_id: 8, quantity: 5 },
      ],
    },
    { customer_id: 5, items: [{ product_id: 3, quantity: 1 }] },
    {
      customer_id: 2,
      items: [
        { product_id: 10, quantity: 2 },
        { product_id: 9, quantity: 10 },
      ],
    },
    {
      customer_id: 3,
      items: [
        { product_id: 11, quantity: 1 },
        { product_id: 12, quantity: 1 },
      ],
    },
    { customer_id: 4, items: [{ product_id: 13, quantity: 2 }] },
    {
      customer_id: 5,
      items: [
        { product_id: 14, quantity: 1 },
        { product_id: 15, quantity: 1 },
      ],
    },
  ];

  const today = new Date();
  const ymd = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(today.getDate()).padStart(2, "0")}`;

  await knex.transaction(async (trx) => {
    for (let i = 0; i < ordersData.length; i++) {
      const { customer_id, items } = ordersData[i];

      // load products
      const ids = items.map((x) => x.product_id);
      const products = await trx("products").whereIn("id", ids);
      const map = new Map(products.map((p) => [p.id, p]));

      // calc subtotal + check stock
      let subtotal = 0;
      for (const it of items) {
        const p = map.get(it.product_id);
        if (!p) throw new Error("Seed product not found");
        if (p.stock < it.quantity) throw new Error("Seed stock not enough");
        subtotal += Number(p.price) * it.quantity;
      }

      const total = subtotal + SHIPPING_FEE;
      const order_number = `ORD-${ymd}-${String(i + 1).padStart(3, "0")}`;

      const [order] = await trx("orders")
        .insert({
          customer_id,
          order_number,
          subtotal,
          shipping_fee: SHIPPING_FEE,
          total,
          shipping_address: "Seed Address",
          status: "pending",
          payment_status: "pending",
        })
        .returning("*");

      for (const it of items) {
        const p = map.get(it.product_id);
        await trx("order_items").insert({
          order_id: order.id,
          product_id: it.product_id,
          quantity: it.quantity,
          price: p.price,
        });

        // decrease stock
        await trx("products")
          .where({ id: it.product_id })
          .update({ stock: trx.raw("stock - ?", [it.quantity]) });
      }
    }
  });
};
