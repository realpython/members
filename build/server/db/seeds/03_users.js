exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('users').del()
  ])
  .then(function() {
    // Inserts seed entries
    return Promise.all([
      knex('users').insert({
        github_username: 'Michael',
        github_id: 987,
        github_display_name: 'Michael Johnson',
        github_access_token: '798',
        github_avatar: 'https://avatars.io/static/default_128.jpg',
        email: 'michael@johnson.com',
        verified: false,
        admin: false
      }).returning('*')
    ])
    .then(function(user) {
      var userID = parseInt(user[0][0].id);
      return Promise.all([
        knex('lessons').select('*')
      ])
      .then(function(lessons) {
        // update users_lessons
        lessons[0].forEach(function(lesson) {
          return knex('users_lessons')
          .insert({
            user_id: userID,
            lesson_id: lesson.id,
            lesson_read: false
          }).returning('*')
          .then(function(results) {
            // console.log(results);
          });
        });
      });
    });
  });
};
