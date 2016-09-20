exports.seed = (knex, Promise) => {
  return knex('users').select('*')
  .then((users) => {
    return Promise.all([
      knex('messages')
      .insert({
        content: 'Awesome lesson!',
        parent_id: null,
        lesson_id: 1,
        user_id: users[0].id,
        created_at: new Date(2015, 06, 9),
        updated_at: new Date(2015, 06, 9)
      })
      .returning('id'),
      knex('messages')
      .insert({
        content: 'Sick!',
        lesson_id: 1,
        parent_id: null,
        user_id: users[0].id,
        created_at: new Date(2016, 06, 9),
        updated_at: new Date(2015, 06, 9)
      }),
      knex('messages')
      .insert({
        content: 'Love it!',
        parent_id: null,
        lesson_id: 2,
        user_id: users[0].id
      }),
      knex('messages')
      .insert({
        content: 'Should not be visible.',
        parent_id: null,
        lesson_id: 2,
        user_id: users[0].id,
        active: false
      })
    ])
    .then((message) => {
      const messageID = parseInt(message[0][0]);
      return Promise.all([
        knex('messages').insert({
          content: 'Just a reply',
          parent_id: messageID,
          lesson_id: 1,
          user_id: users[0].id
        }),
        knex('messages').insert({
          content: 'Just another reply',
          parent_id: messageID,
          lesson_id: 1,
          user_id: users[0].id
        })
      ]);
    });
  });
};
