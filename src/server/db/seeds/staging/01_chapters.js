exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('chapters').del(),
    // Inserts seed entries
    knex('chapters').insert({
      number: 1,
      name: 'Functions and Loops'
    }),
    knex('chapters').insert({
      number: 2,
      name: 'Conditional logic'
    }),
    knex('chapters').insert({
      number: 3,
      name: 'Lists and Dictionaries'
    })
  );
};
