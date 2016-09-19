exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('github_username').unique().notNullable();
    table.integer('github_id').unique().notNullable();
    table.string('github_display_name').unique().notNullable();
    table.string('github_access_token').unique().notNullable();
    table.string('github_avatar').notNullable();
    table.string('email').unique();
    table.boolean('admin').notNullable().defaultTo(false);
    table.boolean('verified').notNullable().defaultTo(false);
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('verify_code').unique();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
