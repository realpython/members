exports.seed = (knex, Promise) => {
  return Promise.all([
    knex('chapters').del(),
    knex('lessons').del()
  ]);
};
