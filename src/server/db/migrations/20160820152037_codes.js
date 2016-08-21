exports.up = function(knex, Promise) {
  return knex.schema.createTable('codes', function(table) {
    table.increments();
    table.string('verify_code').notNullable().unique();
    table.boolean('used').notNullable().defaultTo(false);
    table.boolean('active').notNullable().defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('codes');
};
