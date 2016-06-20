exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('chapters').del(),
    // Inserts seed entries
    knex('chapters').insert({
      order: 1,
      name: 'Functions and Loops',
      standard: 'Control the flow of a program with loops.',
      lessons: JSON.stringify([
        {
          lessonName: 'Lesson 1',
          lessonContent: 'Functions and Loops are awesome!'
        }
      ])
    }),
    knex('chapters').insert({
      order: 2,
      name: 'Conditional logic',
      standard: 'Control the flow of a program with conditionals.',
      lessons: JSON.stringify([
        {
          lessonName: 'Lesson 1',
          lessonContent: 'Conditional logic is awesome!'
        },
        {
          lessonName: 'Lesson 2',
          lessonContent: 'Conditional logic is STILL awesome!'
        }
      ])
    }),
    knex('chapters').insert({
      order: 3,
      name: 'Lists and Dictionaries',
      standard: 'Store and access values in Lists and Dictionaries.'
    })
  );
};
