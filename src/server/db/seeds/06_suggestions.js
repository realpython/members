exports.seed = (knex, Promise) => {
  return knex('users').select('*')
  .then((users) => {
    return Promise.all([
      knex('suggestions').insert({
        title: 'Test',
        description: 'Just a test',
        user_id: users[0].id,
        created_at: new Date(2015, 06, 9)
      }).returning('id'),
      knex('suggestions').insert({
        title: 'More Python!',
        description: 'Can\'t get enough!!!',
        user_id: users[0].id
      })
    ]);
  });
};
