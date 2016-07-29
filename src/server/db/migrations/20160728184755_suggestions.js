exports.up = function(knex, Promise) {
  return knex.schema.createTable('suggestions', function(table) {
    table.increments();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.integer('user_id').references('id').inTable('users').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('suggestions');
};
