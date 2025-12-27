exports.up = async (knex) => {
  await knex.schema.createTable("products", (t) => {
    t.increments("id").primary();
    t.string("name").notNullable();
    t.text("description").nullable();
    t.decimal("price", 14, 2).notNullable();
    t.string("category").notNullable(); // validate ở app
    t.string("brand").nullable();
    t.integer("stock").notNullable().defaultTo(0);
    t.string("image_url").nullable();
    t.decimal("rating", 3, 1).notNullable().defaultTo(0.0);
    t.integer("review_count").notNullable().defaultTo(0);
    t.boolean("is_available").notNullable().defaultTo(true);
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index(["category"]);
    t.index(["price"]);
    t.index(["name"]);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("products");
};
