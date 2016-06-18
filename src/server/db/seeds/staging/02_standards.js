exports.seed = function(knex, Promise) {
  return Promise.all([
    // Deletes ALL existing entries
    knex('standards').del()
  ])
  .then(function() {
    return Promise.all(chapterStandards.map(function(el) {
      return getChapterID(el.chapterName, knex, Promise)
      .then(function(chapter) {
        return insertStandard(el.standardName, chapter.id, knex, Promise);
      });
    }));
  });
};

var chapterStandards = [
  {
    chapterName: 'Functions and Loops',
    standardName: 'Control the flow of a program with loops.'
  },
  {
    chapterName: 'Conditional logic',
    standardName: 'Control the flow of a program with conditionals.'
  },
  {
    chapterName: 'Lists and Dictionaries',
    standardName: 'Store and Access values in Lists and Dictionaries.'
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

function insertStandard(standardName, chapterID, knex, Promise) {
  return new Promise(function(resolve, reject) {
    knex('standards')
      .insert({
        name: standardName,
        chapter_id: parseInt(chapterID)
      })
      .then(function() {
        resolve();
      });
  });
}
