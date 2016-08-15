var Promise = require('es6-promise').Promise;

var chapterQueries = require('../db/queries.chapters');
var userQueries = require('../db/queries.users');

function getTotalActiveLessons(chapters) {
  var total = chapters.reduce(function(acc, chapter) {
    var active = (chapter.lessons).filter(function(lesson) {
      return lesson.lessonActive;
    });
    return acc.concat(active);
  }, []);
  return total;
}

function reduceResults(results) {
  return results.reduce(function(acc, val) {
    if (acc[val.chapterID] === undefined) {
      acc[val.chapterID] = {
        chapterID: val.chapterID,
        chapterOrder: val.chapterOrder,
        chapterName: val.chapterName,
        lessons: []
      };
    }
    acc[val.chapterID].lessons.push({
      lessonID: val.lessonID,
      lessonLessonOrder: val.lessonLessonOrder,
      lessonChapterOrder: val.lessonChapterOrder,
      lessonName: val.lessonName,
      lessonContent: val.lessonContent,
      lessonActive: val.lessonActive
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
  if (a.lessonChapterOrder < b.lessonChapterOrder)
    return -1;
  if (a.lessonChapterOrder > b.lessonChapterOrder)
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
    return parseInt(chapter.order_number) === parseInt(orderID - 1);
  });
}

function getNextChapter(orderID, chapters) {
  return chapters.filter(function(chapter) {
    return parseInt(chapter.order_number) === parseInt(orderID + 1);
  });
}

function getPrevLesson(orderID, lessons) {
  var numberArray = lessons.map(function(lesson) {
    return parseInt(lesson.lesson_order_number);
  });
  var index = numberArray.indexOf(parseInt(orderID));
  var slicedArray = numberArray.slice(0, parseInt(index));
  if (slicedArray.length) {
    var lessonOrderNumber = parseInt(slicedArray.pop());
    return lessons.filter(function(lesson) {
      return parseInt(lesson.lesson_order_number) === lessonOrderNumber;
    });
  } else {
    return false;
  }
}

function getNextLesson(orderID, lessons) {
  var numberArray = lessons.map(function(lesson) {
    return parseInt(lesson.lesson_order_number);
  });
  var index = numberArray.indexOf(parseInt(orderID));
  var slicedArray = numberArray.slice(parseInt(index) + 1);
  if (slicedArray.length) {
    var lessonOrderNumber = parseInt(slicedArray[0]);
    return lessons.filter(function(lesson) {
      return parseInt(lesson.lesson_order_number) === lessonOrderNumber;
    });
  } else {
    return false;
  }
}

function getChapterReadStatus(lessons) {
  for (var i = 0; i < lessons.length; i++) {
    if (!lessons[i].read) {
      return false;
    }
  }
  return true;
}

function getParentMessages(messages) {
  return messages.filter(function(message) {
    return !message.messageParentID;
  });
}

function getChildMessages(parentMessages, allMessages) {
  for (var i = 0; i < allMessages.length; i++) {
    if (allMessages[i].messageParentID) {
      for (var j = 0; j < parentMessages.length; j++) {
        if (!parentMessages[j].replies) {
          parentMessages[j].replies = [];
        }
        if (parentMessages[j].messageID === allMessages[i].messageParentID) {
          parentMessages[j].replies.push(allMessages[i]);
        }
      }
    }
  }
  return parentMessages;
}

function getNextLessonOrderNum(lessons) {
  var numberArray = lessons.map(function(lesson) {
    return parseInt(lesson.lesson_order_number);
  });
  return parseInt(Math.max.apply(Math, numberArray)) + 1;
}

function getNextChapterOrderNum(lessons) {
  var numberArray = lessons.map(function(lesson) {
    return parseInt(lesson.chapter_order_number);
  });
  if (numberArray.length) {
    return parseInt(Math.max.apply(Math, numberArray) + 1);
  } else {
    return 1;
  }
}

function getTotalActiveCompletedLessons(activeLessons, completedLessons) {
  var complete = [];
  completedLessons.forEach(function(completedLesson) {
    activeLessons.forEach(function(active) {
      if (completedLesson.lesson_id === active.lessonID) {
        complete.push(completedLesson);
      }
    });
  });
  return complete;
}

function getSideBarData(userID) {
  return new Promise(function(resolve, reject) {
    // get all chapters and associated lessons
    // for the sidebar and navbar
    return chapterQueries.chaptersAndLessons()
    .then(function(results) {
      // filter, reduce, and sort the results
      var reducedResults = reduceResults(results);
      var chapters = convertArray(reducedResults);
      var sortedChapters = sortLessonsByOrderNumber(chapters);
      // get total active lessons
      var totalActiveLessons = getTotalActiveLessons(
        sortedChapters);
      // get read lessons
      return userQueries.getReadLessons(userID)
      .then(function(lessons) {
        // get active and read lessons
        var totalCompletedLessons = lessons;
        var completed = getTotalActiveCompletedLessons(
          totalActiveLessons, totalCompletedLessons);
        var returnObject = {
          sortedChapters: sortedChapters,
          completed: completed,
          totalActiveLessons: totalActiveLessons
        };
        resolve(returnObject);
      });
    })
    .catch(function(err) {
      reject(err);
    });
  });
}

module.exports = {
  getTotalActiveLessons: getTotalActiveLessons,
  reduceResults: reduceResults,
  convertArray: convertArray,
  sortLessonsByOrderNumber: sortLessonsByOrderNumber,
  getPrevChapter: getPrevChapter,
  getNextChapter: getNextChapter,
  getPrevLesson: getPrevLesson,
  getNextLesson: getNextLesson,
  getChapterReadStatus: getChapterReadStatus,
  getParentMessages: getParentMessages,
  getChildMessages: getChildMessages,
  getNextLessonOrderNum: getNextLessonOrderNum,
  getNextChapterOrderNum: getNextChapterOrderNum,
  getTotalActiveCompletedLessons: getTotalActiveCompletedLessons,
  getSideBarData: getSideBarData
};
