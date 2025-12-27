const db = require("../config/db");

const createMany = (trx, items) =>
  trx("order_items").insert(items).returning("*");

const listByOrderIdWithProduct = (orderId) =>
  db("order_items as oi")
    .join("products as p", "p.id", "oi.product_id")
    .where("oi.order_id", orderId)
    .select(
      "oi.id",
      "oi.order_id",
      "oi.product_id",
      "oi.quantity",
      "oi.price",
      "oi.created_at",
      "p.name as product_name",
      "p.category as product_category",
      "p.brand as product_brand",
      "p.image_url as product_image_url"
    );

module.exports = { createMany, listByOrderIdWithProduct };
