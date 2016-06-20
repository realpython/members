exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('lessons').del()
  ])
  .then(function() {
    return Promise.all(chapterLessons.map(function(el) {
      return getChapterID(el.chapterName, knex, Promise)
      .then(function(chapter) {
        return insertLesson(el.lessonContent, chapter.id, knex, Promise);
      });
    }));
  });
};

var chapterLessons = [
  {
    chapterName: 'Functions and Loops',
    lessonContent: 'Functions and Loops are awesome!'
  },
  {
    chapterName: 'Conditional logic',
    lessonContent: 'Conditional logic is awesome!'
  },
  {
    chapterName: 'Lists and Dictionaries',
    lessonContent: 'Lists and Dictionaries are awesome!'
  }
];

function getChapterID(chapterName, knex, Promise) {
  return new Promise(function(resolve, reject) {
    knex('chapters')
    .select('id')
    .where('name', chapterName)
    .then(function(chapters) {
      resolve(chapters[0]);
    });
  });
}

function insertLesson(lessonContent, chapterID, knex, Promise) {
  return new Promise(function(resolve, reject) {
    knex('lessons')
      .insert({
        content: lessonContent,
        chapter_id: parseInt(chapterID)
      })
      .then(function() {
        resolve();
      });
  });
}
