exports.up = async (knex) => {
  await knex.schema.createTable("order_items", (t) => {
    t.increments("id").primary();

    t.integer("order_id")
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");

    t.integer("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("RESTRICT");

    t.integer("quantity").notNullable();
    t.decimal("price", 14, 2).notNullable(); // giá tại thời điểm đặt
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    t.index(["order_id"]);
    t.index(["product_id"]);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("order_items");
};
