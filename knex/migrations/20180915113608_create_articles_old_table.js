
exports.up = function (knex, Promise) {
  return knex.schema.createTable('old_articles', function (table) {
    table.increments();
    table.integer('reference_id').notNullable();
    table.string('title').notNullable();
    table.string('body').notNullable();
    table.string('author').notNullable();
    table.integer('version').notNullable().defaultTo(1);
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('reference_created_at');
    table.timestamp('reference_updated_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
