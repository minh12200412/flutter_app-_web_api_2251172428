const db = require("../config/db");

const findByEmail = (email) => db("customers").where({ email }).first();
const findById = (id) => db("customers").where({ id }).first();
const create = (data) =>
  db("customers")
    .insert(data)
    .returning([
      "id",
      "email",
      "full_name",
      "phone_number",
      "address",
      "city",
      "postal_code",
      "is_active",
      "created_at",
      "updated_at",
    ]);
const updateById = (id, data) =>
  db("customers")
    .where({ id })
    .update(data)
    .returning([
      "id",
      "email",
      "full_name",
      "phone_number",
      "address",
      "city",
      "postal_code",
      "is_active",
      "created_at",
      "updated_at",
    ]);
const list = () =>
  db("customers").select(
    "id",
    "email",
    "full_name",
    "phone_number",
    "address",
    "city",
    "postal_code",
    "is_active",
    "created_at",
    "updated_at"
  );

module.exports = { findByEmail, findById, create, updateById, list };
