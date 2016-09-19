exports.up = (knex, Promise) => {
  return knex.schema.createTable('users_lessons', (table) => {
    table.increments();
    table.integer('user_id').references('id').inTable('users');
    table.integer('lesson_id').references('id').inTable('lessons');
    table.boolean('lesson_read').notNullable().defaultTo(false);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users_lessons');
};
