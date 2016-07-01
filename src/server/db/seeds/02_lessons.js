exports.seed = function(knex, Promise) {
  return Promise.all([
    // deletes ALL existing entries
    knex('lessons').del()
  ]).then(function() {
    return Promise.all([
      knex('chapters')
        .select('*')
        .orderBy('order_number')
        .returning('*')
    ]);
  }).then(function(chapters) {
    // get chapter order number
    var chapterOrder = chapters[0].map(function(chapter) {
      return chapter.order_number;
    });
    // link lesson name to order number
    var chapterLessons = [
      {
        lessonName: 'Lesson 1a',
        lessonLessonOrder: 1,
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[0]
      },
      {
        lessonName: 'Lesson 1b',
        lessonLessonOrder: 2,
        lessonChapterOrder: 2,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[0]
      },
      {
        lessonName: 'Lesson 1c',
        lessonLessonOrder: 3,
        lessonChapterOrder: 3,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[0]
      },
      {
        lessonName: 'Lesson 2a',
        lessonLessonOrder: 4,
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[1]
      },
      {
        lessonName: 'Lesson 3a',
        lessonLessonOrder: 5,
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonRead: false,
        chapterOrder: chapterOrder[2]
      },
      {
        lessonName: 'Lesson 3b',
        lessonLessonOrder: 6,
        lessonChapterOrder: 2,
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
          el.lessonLessonOrder,
          el.lessonChapterOrder,
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
      .where('order_number', parseInt(chapterOrder))
      .then(function(chapter) {
        resolve(chapter[0]);
      });
  });
}

function createLesson(
  lessonOrder, chapterOrder, lessonName,
  lessonContent, lessonRead, chapterID,
  knex, Promise
) {
  return new Promise(function(resolve, reject) {
    knex('lessons')
      .insert({
        lesson_order_number: parseInt(lessonOrder),
        chapter_order_number: parseInt(chapterOrder),
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
