function getTotalLessons(chapters) {
  return chapters.reduce(function(acc, chapter) {
    return acc.concat(chapter.lessons);
  }, []);
}

function getCompletedLessons(lessons) {
  return lessons.filter(function(lesson) {
    return lesson.lessonRead;
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

function sortLessonsByOrderNumber(chaptersAndLessons) {
  // sort lessons by lesson order number
  var sortedLessons = chaptersAndLessons.map(function(chapter) {
    chapter.lessons.sort(compareLessonOrder);
    return chapter;
  });
  // sort chapters by chapter order number
  var sortedChapters = sortedLessons.sort(compareChapterOrder);
  return sortedChapters;
}

function compareLessonOrder(a, b) {
  if (a.lessonOrder < b.lessonOrder)
    return -1;
  if (a.lessonOrder > b.lessonOrder)
    return 1;
  return 0;
}

function compareChapterOrder(a, b) {
  if (a.chapterOrder < b.chapterOrder)
    return -1;
  if (a.chapterOrder > b.chapterOrder)
    return 1;
  return 0;
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

function getPrevLesson(orderID, lessons) {
  return lessons.filter(function(lesson) {
    return parseInt(lesson.lessonOrder) === parseInt(orderID - 1);
  });
}

function getNextLesson(orderID, lessons) {
  return lessons.filter(function(lesson) {
    return parseInt(lesson.lessonOrder) === parseInt(orderID + 1);
  });
}

function getChapterReadStatus(lessons) {
  for (var i = 0; i < lessons.length; i++) {
    if (!lessons[i].read) {
      return false;
    }
  }
  return true;
}

module.exports = {
  getTotalLessons: getTotalLessons,
  getCompletedLessons: getCompletedLessons,
  reduceResults: reduceResults,
  convertArray: convertArray,
  sortLessonsByOrderNumber: sortLessonsByOrderNumber,
  getPrevChapter: getPrevChapter,
  getNextChapter: getNextChapter,
  getPrevLesson: getPrevLesson,
  getNextLesson: getNextLesson,
  getChapterReadStatus: getChapterReadStatus
};
