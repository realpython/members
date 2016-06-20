exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('chapters').del(),
    // Inserts seed entries
    knex('chapters').insert({
      order: 1,
      name: 'Functions and Loops',
      standard: 'Control the flow of a program with loops.'
    }),
    knex('chapters').insert({
      order: 2,
      name: 'Conditional logic',
      standard: 'Control the flow of a program with conditionals.'
    }),
    knex('chapters').insert({
      order: 3,
      name: 'Lists and Dictionaries',
      standard: 'Store and access values in Lists and Dictionaries.'
    })
  );
};
