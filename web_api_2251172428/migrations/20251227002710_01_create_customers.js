exports.up = async (knex) => {
  await knex.schema.createTable("customers", (t) => {
    t.increments("id").primary();
    t.string("email").notNullable().unique();
    t.string("password").notNullable();
    t.string("full_name").notNullable();
    t.string("phone_number").nullable();
    t.string("address").nullable();
    t.string("city").nullable();
    t.string("postal_code").nullable();
    t.boolean("is_active").notNullable().defaultTo(true);
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("customers");
};
