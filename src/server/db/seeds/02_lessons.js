exports.seed = function(knex, Promise) {
  return Promise.all([
    // deletes ALL existing entries
    knex('lessons').del()
  ]).then(function() {
    return Promise.all([
      knex('chapters')
        .select('*')
        .orderBy('order')
        .returning('*')
    ]);
  }).then(function(chapters) {
    // get chapter order number
    var chapterOrder = chapters[0].map(function(chapter) {
      return chapter.order;
    });
    // link lesson name to order number
    var chapterLessons = [
      {
        lessonName: 'Lesson 1a',
        lessonOrder: 1,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[0]
      },
      {
        lessonName: 'Lesson 1b',
        lessonOrder: 2,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[0]
      },
      {
        lessonName: 'Lesson 1c',
        lessonOrder: 3,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[0]
      },
      {
        lessonName: 'Lesson 2a',
        lessonOrder: 1,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[1]
      },
      {
        lessonName: 'Lesson 3a',
        lessonOrder: 1,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[2]
      },
      {
        lessonName: 'Lesson 3b',
        lessonOrder: 2,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[2]
      }
    ];
    // get chapter ID from order number, add new lesson
    return Promise.all(chapterLessons.map(function(el) {
      return getChapterID(el.chapterOrder, knex, Promise)
      .then(function(chapter) {
        return createLesson(
          el.lessonOrder,
          el.lessonName,
          el.lessonContent,
          el.lessonRead,
          chapter.id,
          knex,
          Promise
        );
      });
    }));
  });
};

function getChapterID(chapterOrder, knex, Promise) {
  return new Promise(function(resolve, reject) {
    knex('chapters')
      .select('id')
      .where('order', parseInt(chapterOrder))
      .then(function(chapter) {
        resolve(chapter[0]);
      });
  });
}

function createLesson(
  order, lessonName, lessonContent,
  lessonRead, chapterID, knex, Promise
) {
  return new Promise(function(resolve, reject) {
    knex('lessons')
      .insert({
        order: parseInt(order),
        name: lessonName,
        content: lessonContent,
        read: lessonRead,
        chapter_id: chapterID
      })
      .then(function() {
        resolve();
      });
  });
}
