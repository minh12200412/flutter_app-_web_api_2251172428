const db = require("../config/db");

const findById = (id) => db("products").where({ id }).first();

const create = (data) =>
  db("products")
    .insert(data)
    .returning([
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
      "updated_at",
    ]);

const updateById = (id, data) =>
  db("products")
    .where({ id })
    .update(data)
    .returning([
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
      "updated_at",
    ]);

const removeById = (id) => db("products").where({ id }).del();

module.exports = { findById, create, updateById, removeById };
