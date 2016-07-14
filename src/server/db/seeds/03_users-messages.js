exports.seed = function(knex, Promise) {
  return Promise.all([
    // deletes ALL existing entries
    knex('users').del(),
    knex('messages').del(),
    knex('users').insert({
      github_username: 'Michael',
      github_id: 987,
      github_display_name: 'Michael Johnson',
      github_access_token: '798',
      github_avatar: 'https://avatars.io/static/default_128.jpg',
      email: 'michael@johnson.com',
      verified: false,
      admin: false
    })
  ]).then(function() {
    return Promise.all([
      knex('users').select('*')
    ]);
  }).then(function(users) {
    return Promise.all([
      knex('messages').insert({
        content: 'Awesome lesson!',
        lesson_id: 1,
        user_id: users[0][0].id,
        created_at: new Date(2015, 06, 9)
      }),
      knex('messages').insert({
        content: 'Sick!',
        lesson_id: 1,
        user_id: users[0][0].id,
        created_at: new Date(2016, 06, 9)
      }),
      knex('messages').insert({
        content: 'Love it!',
        lesson_id: 2,
        user_id: users[0][0].id
      })
    ]);
  });
};
