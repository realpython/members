exports.seed = function(knex, Promise) {
  return Promise.all([
    // deletes ALL existing entries
    knex('suggestions').del()
  ]).then(function() {
    return Promise.all([
      knex('users')
      .select('*')
    ])
    .then(function(users) {
      return Promise.all([
        knex('suggestions').insert({
          title: 'Test',
          description: 'Just a test',
          user_id: users[0][0].id,
          created_at: new Date(2015, 06, 9)
        }).returning('id'),
        knex('suggestions').insert({
          title: 'More Python!',
          description: 'Can\'t get enough!!!',
          user_id: users[0][0].id
        })
      ]);
    });
  });
};
