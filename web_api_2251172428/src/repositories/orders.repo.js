const db = require("../config/db");

const create = (trx, data) => trx("orders").insert(data).returning("*");
const findById = (id) => db("orders").where({ id }).first();
const updateById = (trx, id, data) =>
  trx("orders").where({ id }).update(data).returning("*");

module.exports = { create, findById, updateById };
