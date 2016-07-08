exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),
    // Inserts seed entries
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
  );
};
