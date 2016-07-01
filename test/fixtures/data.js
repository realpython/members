// queries.chapters.js => chaptersAndLessons()
var base = [
  {
    lessonID: 5,
    lessonOrder: 1,
    lessonName: 'Lesson 2a',
    lessonContent: 'test',
    lessonRead: true,
    chapterID: 2,
    chapterOrder: 2,
    chapterName: 'Conditional logic',
    chapterRead: false
  },
  {
    lessonID: 3,
    lessonOrder: 3,
    lessonName: 'Lesson 1c',
    lessonContent: 'test',
    lessonRead: false,
    chapterID: 1,
    chapterOrder: 1,
    chapterName: 'Functions and Loops',
    chapterRead: false
  },
  {
    lessonID: 2,
    lessonOrder: 2,
    lessonName: 'Lesson 1b',
    lessonContent: 'test',
    lessonRead: false,
    chapterID: 1,
    chapterOrder: 1,
    chapterName: 'Functions and Loops',
    chapterRead: false
  },
  {
    lessonID: 1,
    lessonOrder: 1,
    lessonName: 'Lesson 1a',
    lessonContent: 'test',
    lessonRead: false,
    chapterID: 1,
    chapterOrder: 1,
    chapterName: 'Functions and Loops',
    chapterRead: false
  }
];

var reduced = {
  1: {
    chapterID: 1,
    chapterOrder: 1,
    chapterName: 'Functions and Loops',
    chapterRead: false,
    lessons: [
      {
        lessonContent: 'test',
        lessonID: 3,
        lessonName: 'Lesson 1c',
        lessonOrder: 3,
        lessonRead: false
      },
      {
        lessonContent: 'test',
        lessonID: 2,
        lessonName: 'Lesson 1b',
        lessonOrder: 2,
        lessonRead: false
      },
      {
        lessonContent: 'test',
        lessonID: 1,
        lessonName: 'Lesson 1a',
        lessonOrder: 1,
        lessonRead: false
      }
    ]
  },
  2: {
    chapterID: 2,
    chapterOrder: 2,
    chapterName: 'Conditional logic',
    chapterRead: false,
    lessons: [
      {
        lessonContent: 'test',
        lessonID: 5,
        lessonName: 'Lesson 2a',
        lessonOrder: 1,
        lessonRead: true
      }
    ]
  }
};

var converted = [
  {
    chapterID: 1,
    chapterOrder: 1,
    chapterName: 'Functions and Loops',
    chapterRead: false,
    lessons: [
      {
        lessonContent: 'test',
        lessonID: 3,
        lessonName: 'Lesson 1c',
        lessonOrder: 3,
        lessonRead: false
      },
      {
        lessonContent: 'test',
        lessonID: 2,
        lessonName: 'Lesson 1b',
        lessonOrder: 2,
        lessonRead: false
      },
      {
        lessonContent: 'test',
        lessonID: 1,
        lessonName: 'Lesson 1a',
        lessonOrder: 1,
        lessonRead: false
      }
    ]
  },
  {
    chapterID: 2,
    chapterOrder: 2,
    chapterName: 'Conditional logic',
    chapterRead: false,
    lessons: [
      {
        lessonContent: 'test',
        lessonID: 5,
        lessonName: 'Lesson 2a',
        lessonOrder: 1,
        lessonRead: true
      }
    ]
  }
];

var sorted = [
  {
    chapterID: 1,
    chapterOrder: 1,
    chapterName: 'Functions and Loops',
    chapterRead: false,
    lessons: [
      {
        lessonContent: 'test',
        lessonID: 1,
        lessonName: 'Lesson 1a',
        lessonOrder: 1,
        lessonRead: false
      },
      {
        lessonContent: 'test',
        lessonID: 2,
        lessonName: 'Lesson 1b',
        lessonOrder: 2,
        lessonRead: false
      },
      {
        lessonContent: 'test',
        lessonID: 3,
        lessonName: 'Lesson 1c',
        lessonOrder: 3,
        lessonRead: false
      }
    ]
  },
  {
    chapterID: 2,
    chapterOrder: 2,
    chapterName: 'Conditional logic',
    chapterRead: false,
    lessons: [
      {
        lessonContent: 'test',
        lessonID: 5,
        lessonName: 'Lesson 2a',
        lessonOrder: 1,
        lessonRead: true
      }
    ]
  }
];

var totalLessons = [
  {
    lessonContent: 'test',
    lessonID: 1,
    lessonName: 'Lesson 1a',
    lessonOrder: 1,
    lessonRead: false
  },
  {
    lessonContent: 'test',
    lessonID: 2,
    lessonName: 'Lesson 1b',
    lessonOrder: 2,
    lessonRead: false
  },
  {
    lessonContent: 'test',
    lessonID: 3,
    lessonName: 'Lesson 1c',
    lessonOrder: 3,
    lessonRead: false
  },
  {
    lessonContent: 'test',
    lessonID: 5,
    lessonName: 'Lesson 2a',
    lessonOrder: 1,
    lessonRead: true
  }
];

var completedLessons = [
  {
    lessonContent: 'test',
    lessonID: 5,
    lessonName: 'Lesson 2a',
    lessonOrder: 1,
    lessonRead: true
  }
];

module.exports = {
  base: base,
  reduced: reduced,
  converted: converted,
  sorted: sorted,
  totalLessons: totalLessons,
  completedLessons: completedLessons
};
