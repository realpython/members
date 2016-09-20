exports.seed = (knex, Promise) => {
  return knex('users')
  .insert({
    github_username: 'Michael',
    github_id: 987,
    github_display_name: 'Michael Johnson',
    github_access_token: '798',
    github_avatar: 'https://avatars.io/static/default_128.jpg',
    email: 'michael@johnson.com',
    verified: false,
    admin: false
  })
  .returning('*')
  .then((user) => {
    const userID = parseInt(user[0].id);
    return knex('lessons').select('*')
    .then((lessons) => {
      // update users_lessons
      lessons.forEach((lesson) => {
        return knex('users_lessons')
        .insert({
          user_id: userID,
          lesson_id: lesson.id,
          lesson_read: false
        })
        .returning('*')
        .then((results) => {});
      });
    });
  });
};
