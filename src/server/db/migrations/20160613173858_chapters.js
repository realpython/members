exports.up = (knex, Promise) => {
  return knex.schema.createTable('chapters', (table) => {
    table.increments();
    table.integer('order_number').unique().notNullable();
    table.string('name').unique().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.boolean('active').notNullable().defaultTo(true);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('chapters');
};
