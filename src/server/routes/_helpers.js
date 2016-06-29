function getCompletedChapters(chaptersAndLessons) {
  return chaptersAndLessons.filter(function(chapter) {
    return chapter.chapterRead;
  });
}

function reduceResults(results) {
  return results.reduce(function(acc, val) {
    if (acc[val.chapterID] === undefined) {
      acc[val.chapterID] = {
        chapterID: val.chapterID,
        chapterOrder: val.chapterOrder,
        chapterName: val.chapterName,
        chapterRead: val.chapterRead,
        lessons: []
      };
    }
    acc[val.chapterID].lessons.push({
      lessonID: val.lessonID,
      lessonOrder: val.lessonOrder,
      lessonName: val.lessonName,
      lessonContent: val.lessonContent,
      lessonRead: val.lessonRead
    });
    return acc;
  }, {});
}

function convertArray(obj) {
  var dataArray = [];
  for (var key in obj) {
    dataArray.push(obj[key]);
  }
  return dataArray;
}

function getPrevChapter(orderID, chapters) {
  return chapters.filter(function(chapter) {
    return parseInt(chapter.chapterOrder) === parseInt(orderID - 1);
  });
}

function getNextChapter(orderID, chapters) {
  return chapters.filter(function(chapter) {
    return parseInt(chapter.chapterOrder) === parseInt(orderID + 1);
  });
}

module.exports = {
  getCompletedChapters: getCompletedChapters,
  reduceResults: reduceResults,
  convertArray: convertArray,
  getPrevChapter: getPrevChapter,
  getNextChapter: getNextChapter
};
