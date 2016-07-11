exports.seed = function(knex, Promise) {
  return Promise.all([
    // deletes ALL existing entries
    knex('messages').del()
  ]).then(function() {
    return Promise.all([
      knex('users').select('*')
    ]);
  }).then(function(users) {
    return Promise.all([
      knex('messages').insert({
        content: 'Awesome lesson!',
        lesson_id: 1,
        user_id: 1,
        created_at: new Date(2015, 06, 9)
      }),
      knex('messages').insert({
        content: 'Sick!',
        lesson_id: 1,
        user_id: 1,
        created_at: new Date(2016, 06, 9)
      }),
      knex('messages').insert({
        content: 'Love it!',
        lesson_id: 2,
        user_id: 1
      })
    ]);
  });
};
