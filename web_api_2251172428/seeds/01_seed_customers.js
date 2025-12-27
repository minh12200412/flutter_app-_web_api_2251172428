const bcrypt = require("bcryptjs");

exports.seed = async (knex) => {
  await knex("order_items").del();
  await knex("orders").del();
  await knex("products").del();
  await knex("customers").del();

  const pw = await bcrypt.hash("password123", 10);

  await knex("customers").insert([
    {
      email: "admin@example.com",
      password: pw,
      full_name: "Admin User",
      city: "Hà Nội",
    },
    {
      email: "c1@example.com",
      password: pw,
      full_name: "Customer 1",
      city: "Hà Nội",
    },
    {
      email: "c2@example.com",
      password: pw,
      full_name: "Customer 2",
      city: "HCM",
    },
    {
      email: "c3@example.com",
      password: pw,
      full_name: "Customer 3",
      city: "Đà Nẵng",
    },
    {
      email: "c4@example.com",
      password: pw,
      full_name: "Customer 4",
      city: "Hải Phòng",
    },
  ]);
};
