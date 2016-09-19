exports.up = (knex, Promise) => {
  return knex.schema.createTable('codes', (table) => {
    table.increments();
    table.string('verify_code').notNullable().unique();
    table.boolean('used').notNullable().defaultTo(false);
    table.boolean('active').notNullable().defaultTo(true);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('codes');
};
