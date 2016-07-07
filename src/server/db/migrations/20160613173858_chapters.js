exports.up = function(knex, Promise) {
  return knex.schema.createTable('chapters', function(table) {
    table.increments();
    table.integer('order_number').unique().notNullable();
    table.string('name').unique().notNullable();
    table.boolean('read').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('chapters');
};
