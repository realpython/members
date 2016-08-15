exports.up = function(knex, Promise) {
  return knex.schema.createTable('chapters', function(table) {
    table.increments();
    table.integer('order_number').unique().notNullable();
    table.string('name').unique().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.boolean('active').notNullable().defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('chapters');
};
