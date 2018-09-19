
exports.up = function (knex, Promise) {
  return knex.schema.createTable('products', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.string('price').notNullable();
    table.string('inventory').notNullable();
    table.integer('version').notNullable().defaultTo(1);
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('products');
};
