exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('username').unique().notNullable();
    table.string('display_name').unique().notNullable();
    table.string('email').unique();
    table.string('access_token').unique().notNullable();
    table.boolean('admin').notNullable().defaultTo(false);
    table.boolean('verified').notNullable().defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
