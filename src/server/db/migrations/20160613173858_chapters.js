exports.up = function(knex, Promise) {
  return knex.schema.createTable('chapters', function(table) {
    table.increments();
    table.integer('order').unique().notNullable();
    table.string('name').unique().notNullable();
    table.string('standard').notNullable();
    table.json('lessons');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('chapters');
};
