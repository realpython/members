exports.seed = (knex, Promise) => {
  return knex('users').select('*')
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
