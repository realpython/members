exports.up = function(knex, Promise) {
  return knex.schema.createTable('lessons', function(table) {
    table.increments();
    table.integer('lesson_order_number').notNullable();
    table.integer('chapter_order_number').notNullable();
    table.string('name').unique().notNullable();
    table.text('content').notNullable();
    table.boolean('read').notNullable().defaultTo(false);
    table.integer('chapter_id').references('id').inTable('chapters').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('lessons');
};
