exports.up = async (knex) => {
  await knex.schema.createTable("orders", (t) => {
    t.increments("id").primary();

    t.integer("customer_id")
      .notNullable()
      .references("id")
      .inTable("customers")
      .onDelete("RESTRICT");

    t.string("order_number").notNullable().unique();
    t.decimal("subtotal", 14, 2).notNullable();
    t.decimal("shipping_fee", 14, 2).notNullable().defaultTo(0);
    t.decimal("total", 14, 2).notNullable();

    t.timestamp("order_date").notNullable().defaultTo(knex.fn.now());
    t.string("shipping_address").notNullable();

    t.string("status").notNullable().defaultTo("pending");
    t.string("payment_method").nullable();
    t.string("payment_status").notNullable().defaultTo("pending");

    t.text("notes").nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index(["customer_id"]);
    t.index(["status"]);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("orders");
};
