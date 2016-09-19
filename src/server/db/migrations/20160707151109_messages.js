exports.up = (knex, Promise) => {
  return knex.schema.createTable('messages', (table) => {
    table.increments();
    table.text('content').notNullable();
    table.integer('parent_id').defaultTo(null);
    table.integer('lesson_id').references('id').inTable('lessons').notNullable();
    table.integer('user_id').references('id').inTable('users').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.boolean('active').notNullable().defaultTo(true);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('messages');
};
