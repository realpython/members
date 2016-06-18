exports.up = function(knex, Promise) {
  return knex.schema.createTable('lessons', function(table) {
    table.increments();
    table.string('content').notNullable();
    table.integer('chapter_id')
      .references('id')
      .inTable('chapters')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('lessons');
};
