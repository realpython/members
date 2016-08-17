exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    // knex('chapters').del(),
    // Inserts seed entries
    knex('chapters').insert({
      order_number: 1,
      name: 'Functions and Loops'
    }),
    knex('chapters').insert({
      order_number: 2,
      name: 'Conditional logic'
    }),
    knex('chapters').insert({
      order_number: 3,
      name: 'Lists and Dictionaries'
    }),
    knex('chapters').insert({
      order_number: 4,
      name: 'Inactive Chapter',
      active: false
    })
  );
};
