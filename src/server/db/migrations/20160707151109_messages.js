exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', function(table) {
    table.increments();
    table.text('content').notNullable();
    table.integer('lesson_id').references('id').inTable('lessons').notNullable();
    table.integer('user_id').references('id').inTable('users').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
