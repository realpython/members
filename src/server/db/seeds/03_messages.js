exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('messages').del(),
    // Inserts seed entries
    knex('messages').insert({
      content: 'Awesome lesson!',
      lesson_id: 1
    })
  );
};
