exports.up = function(knex, Promise) {
  return knex.schema.createTable('standards', function(table) {
    table.increments();
    table.string('name').unique().notNullable();
    table.integer('chapter_id')
      .references('id')
      .inTable('chapters')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('standards');
};
