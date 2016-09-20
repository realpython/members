const chapterQueries = require('../db/queries/chapters');
const userQueries = require('../db/queries/users');
const lessonQueries = require('../db/queries/lessons');
const messageQueries = require('../db/queries/messages');
const usersLessonsQueries = require('../db/queries/users_lessons');

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

function getSideBarData(userID, callback) {
  // get all chapters and associated lessons for the sidebar and navbar
  return new Promise((resolve, reject) => {
    chapterQueries.chaptersAndLessons((err, results) => {
      if (err) reject(err);
      // filter, reduce, and sort the results
      const reducedResults = reduceResults(results);
      const chapters = convertArray(reducedResults);
      const sortedChapters = sortLessonsByOrderNumber(chapters);
      // get total active lessons
      const totalActiveLessons = getTotalActiveLessons(sortedChapters);
      // get read lessons
      userQueries.getReadLessons(userID, (err, lessons) => {
        if (err) reject(err);
        // get active and read lessons
        const totalCompletedLessons = lessons;
        const completed = getTotalActiveCompletedLessons(
          totalActiveLessons, totalCompletedLessons);
        const returnObject = {
          sortedChapters: sortedChapters,
          completed: completed,
          totalActiveLessons: totalActiveLessons
        };
        resolve(returnObject);
      });
    });
  })
  .then((data) => {
    const sortedChapters = data.sortedChapters;
    const completed = data.completed;
    const totalActiveLessons = data.totalActiveLessons;
    // get completed percentage
    const percentage = (
      (completed.length / totalActiveLessons.length) * 100).toFixed(0);
    // get feed data
    userQueries.getMessageFeedData((err, messageFeedData) => {
      if (err) callback(err);
      // get total users
      userQueries.getTotalUsers((err, totalUsers) => {
        if (err) callback(err);
        const allData = {
          sortedChapters,
          percentage,
          completed,
          messageFeedData,
          totalActiveLessons,
          totalUsers
        };
        callback(null, allData);
      });
    });
  })
  .catch((err) => {
    callback(err);
  });
}

function addNewLesson(lessonObject, callback) {
  // get order numbers for active lessons
  lessonQueries.getActiveLessonOrderNumbers((err, lessonOrders) => {
    if (err) callback(err);
    const lessonOrderNum = getNextLessonOrderNum(lessonOrders);
    lessonObject.lesson_order_number = parseInt(lessonOrderNum);
    // get lessons from associated chapter
    lessonQueries.getLessonChapterOrderNumsFromChapterID(
      lessonObject.chapter_id, (err, lessons) => {
      if (err) callback(err);
      const chapterOrderNum = getNextChapterOrderNum(lessons);
      lessonObject.chapter_order_number = parseInt(chapterOrderNum);
      // add lesson
      lessonQueries.addLesson(lessonObject, (err, lesson) => {
        if (err) callback(err);
        callback(null, lesson);
      });
    });
  });
}

function addNewUser(userObject, callback) {
  userQueries.addUser(userObject, (err, user) => {
    if(err) {
      callback(err);
    } else if (user) {
      if (user.length) {
        const userID = parseInt(user[0].id);
        lessonQueries.getAllLessons((err, lessons) => {
          if(err) callback(err);
          lessons.forEach(function(lesson) {
            const newRow = {
              user_id: userID,
              lesson_id: lesson.id
            };
            usersLessonsQueries.addRow(newRow, (err, row) => {
              if(err) callback(err);
            });
          });
          callback(null, user);
        });
      }
    }
  });
}

// TODO: Major refactor!
function getSingleLessonInfo(lessonID, userID, callback) {
  lessonQueries.getSingleLesson(parseInt(lessonID), (err, singleLesson) => {
    if (err) {
      callback(err);
    } else if(singleLesson) {
      if (singleLesson.length && singleLesson[0].active) {
        const lessonObject = singleLesson[0];
        // get all lessons
        lessonQueries.getActiveLessons((err, lessons) => {
          if (err) {
            callback(err);
          } else if(lessons) {
            if (lessons.length) {
              const returnObject = {};
              returnObject.previousLesson = getPrevLesson(
                lessonObject.lesson_order_number, lessons);
              returnObject.nextLesson = getNextLesson(
                lessonObject.lesson_order_number, lessons);
              // get all associated messages, replies, and user info
              return messageQueries.messagesAndUsers(
                parseInt(lessonObject.id), (err, messages) => {
                // check if lesson is read
                usersLessonsQueries.getSingleLesson(
                  parseInt(lessonID), parseInt(userID), (err, singeLesson) => {
                  if (err) {
                    callback(err);
                  } else if (singeLesson) {
                    if (singeLesson[0].lesson_read) {
                      returnObject.lessonRead = true;
                    } else {
                      returnObject.lessonRead = false;
                    }
                    const totalCompletedLessons = lessons;
                    // filter, reduce, and sort the results
                    const parentMessages = getParentMessages(messages);
                    const formattedMessages = getChildMessages(
                      parentMessages, messages);
                    returnObject.userMessages = formattedMessages;
                    returnObject.title = 'Textbook LMS - ' + lessonObject.name;
                    returnObject.pageTitle = lessonObject.name;
                    returnObject.singleLesson = lessonObject;
                    callback(null, returnObject);
                  }
                });
              });
            }
          }
        });
      } else {
        callback(err);
      }
    } else {
      callback(err);
    }
  });
}

module.exports = {
  addNewUser,
  addNewLesson,
  getSingleLessonInfo,
  getTotalActiveLessons: getTotalActiveLessons,
  reduceResults: reduceResults,
  convertArray: convertArray,
  sortLessonsByOrderNumber: sortLessonsByOrderNumber,
  getPrevChapter: getPrevChapter,
  getNextChapter: getNextChapter,
  getPrevLesson: getPrevLesson,
  getNextLesson: getNextLesson,
  getChildMessages: getChildMessages,
  getNextLessonOrderNum: getNextLessonOrderNum,
  getNextChapterOrderNum: getNextChapterOrderNum,
  getTotalActiveCompletedLessons: getTotalActiveCompletedLessons,
  getSideBarData: getSideBarData,
  getParentMessages: getParentMessages
};
