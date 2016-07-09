// queries.chapters.js => chaptersAndLessons()
var base = [
  {
    lessonID: 3,
    lessonLessonOrder: 1,
    lessonChapterOrder: 1,
    lessonName: 'Lesson 1a',
    lessonContent: 'test',
    lessonRead: false,
    chapterID: 1,
    chapterOrder: 1,
    chapterName: 'Functions and Loops',
    chapterRead: false
  },
  {
    lessonID: 2,
    lessonLessonOrder: 3,
    lessonChapterOrder: 3,
    lessonName: 'Lesson 1c',
    lessonContent: 'test',
    lessonRead: false,
    chapterID: 1,
    chapterOrder: 1,
    chapterName: 'Functions and Loops',
    chapterRead: false
  },
  {
    lessonID: 1,
    lessonLessonOrder: 2,
    lessonChapterOrder: 2,
    lessonName: 'Lesson 1b',
    lessonContent: 'test',
    lessonRead: false,
    chapterID: 1,
    chapterOrder: 1,
    chapterName: 'Functions and Loops',
    chapterRead: false
  },
  {
    lessonID: 6,
    lessonLessonOrder: 6,
    lessonChapterOrder: 2,
    lessonName: 'Lesson 3b',
    lessonContent: 'test',
    lessonRead: false,
    chapterID: 2,
    chapterOrder: 3,
    chapterName: 'Lists and Dictionaries',
    chapterRead: false
  },
  {
    lessonID: 4,
    lessonLessonOrder: 5,
    lessonChapterOrder: 1,
    lessonName: 'Lesson 3a',
    lessonContent: 'test',
    lessonRead: false,
    chapterID: 2,
    chapterOrder: 3,
    chapterName: 'Lists and Dictionaries',
    chapterRead: false
  },
  {
    lessonID: 5,
    lessonLessonOrder: 4,
    lessonChapterOrder: 1,
    lessonName: 'Lesson 2a',
    lessonContent: 'test',
    lessonRead: false,
    chapterID: 3,
    chapterOrder: 2,
    chapterName: 'Conditional logic',
    chapterRead: false
  }
];

var reduced = {
  1: {
    chapterID: 1,
    chapterName: 'Functions and Loops',
    chapterOrder: 1,
    chapterRead: false,
    lessons: [
      {
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonID: 3,
        lessonLessonOrder: 1,
        lessonName: 'Lesson 1a',
        lessonRead: false
      },
      {
        lessonChapterOrder: 3,
        lessonContent: 'test',
        lessonID: 2,
        lessonLessonOrder: 3,
        lessonName: 'Lesson 1c',
        lessonRead: false
      },
      {
        lessonChapterOrder: 2,
        lessonContent: 'test',
        lessonID: 1,
        lessonLessonOrder: 2,
        lessonName: 'Lesson 1b',
        lessonRead: false
      }
    ]
  },
  2: {
    chapterID: 2,
    chapterName: 'Lists and Dictionaries',
    chapterOrder: 3,
    chapterRead: false,
    lessons: [
      {
        lessonChapterOrder: 2,
        lessonContent: 'test',
        lessonID: 6,
        lessonLessonOrder: 6,
        lessonName: 'Lesson 3b',
        lessonRead: false
      },
      {
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonID: 4,
        lessonLessonOrder: 5,
        lessonName: 'Lesson 3a',
        lessonRead: false
      }
    ]
  },
  3: {
    chapterID: 3,
    chapterName: 'Conditional logic',
    chapterOrder: 2,
    chapterRead: false,
    lessons: [
      {
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonID: 5,
        lessonLessonOrder: 4,
        lessonName: 'Lesson 2a',
        lessonRead: false
      }
    ]
  }
};

var converted = [
  {
    chapterID: 1,
    chapterName: 'Functions and Loops',
    chapterOrder: 1,
    chapterRead: false,
    lessons: [
      {
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonID: 3,
        lessonLessonOrder: 1,
        lessonName: 'Lesson 1a',
        lessonRead: false
      },
      {
        lessonChapterOrder: 3,
        lessonContent: 'test',
        lessonID: 2,
        lessonLessonOrder: 3,
        lessonName: 'Lesson 1c',
        lessonRead: false
      },
      {
        lessonChapterOrder: 2,
        lessonContent: 'test',
        lessonID: 1,
        lessonLessonOrder: 2,
        lessonName: 'Lesson 1b',
        lessonRead: false
      }
    ]
  },
  {
    chapterID: 2,
    chapterName: 'Lists and Dictionaries',
    chapterOrder: 3,
    chapterRead: false,
    lessons: [
      {
        lessonChapterOrder: 2,
        lessonContent: 'test',
        lessonID: 6,
        lessonLessonOrder: 6,
        lessonName: 'Lesson 3b',
        lessonRead: false
      },
      {
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonID: 4,
        lessonLessonOrder: 5,
        lessonName: 'Lesson 3a',
        lessonRead: false
      }
    ]
  },
  {
    chapterID: 3,
    chapterName: 'Conditional logic',
    chapterOrder: 2,
    chapterRead: false,
    lessons: [
      {
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonID: 5,
        lessonLessonOrder: 4,
        lessonName: 'Lesson 2a',
        lessonRead: false
      }
    ]
  }
];

var sorted = [
  {
    chapterID: 1,
    chapterName: 'Functions and Loops',
    chapterOrder: 1,
    chapterRead: false,
    lessons: [
      {
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonID: 3,
        lessonLessonOrder: 1,
        lessonName: 'Lesson 1a',
        lessonRead: false
      },
      {
        lessonChapterOrder: 2,
        lessonContent: 'test',
        lessonID: 1,
        lessonLessonOrder: 2,
        lessonName: 'Lesson 1b',
        lessonRead: false
      },
      {
        lessonChapterOrder: 3,
        lessonContent: 'test',
        lessonID: 2,
        lessonLessonOrder: 3,
        lessonName: 'Lesson 1c',
        lessonRead: false
      }
    ]
  },
  {
    chapterID: 3,
    chapterName: 'Conditional logic',
    chapterOrder: 2,
    chapterRead: false,
    lessons: [
      {
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonID: 5,
        lessonLessonOrder: 4,
        lessonName: 'Lesson 2a',
        lessonRead: false
      }
    ]
  },
  {
    chapterID: 2,
    chapterName: 'Lists and Dictionaries',
    chapterOrder: 3,
    chapterRead: false,
    lessons: [
      {
        lessonChapterOrder: 1,
        lessonContent: 'test',
        lessonID: 4,
        lessonLessonOrder: 5,
        lessonName: 'Lesson 3a',
        lessonRead: false
      },
      {
        lessonChapterOrder: 2,
        lessonContent: 'test',
        lessonID: 6,
        lessonLessonOrder: 6,
        lessonName: 'Lesson 3b',
        lessonRead: false
      }
    ]
  }
];

var chapters = [
  {
    id: 1,
    order_number: 1,
    name: 'Functions and Loops',
    read: false,
    created_at: '2016-07-08T23:49:03.267Z'
  },
  {
    id: 3,
    order_number: 2,
    name: 'Conditional logic',
    read: false,
    created_at: '2016-07-08T23:49:03.268Z'
  },
  {
    id: 2,
    order_number: 3,
    name: 'Lists and Dictionaries',
    read: false,
    created_at: '2016-07-08T23:49:03.267Z '
  }
];

module.exports = {
  base: base,
  reduced: reduced,
  converted: converted,
  sorted: sorted,
  chapters: chapters
};
