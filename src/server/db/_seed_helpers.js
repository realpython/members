(function() {

  'use strict';

  const knex = require('./connection');

  function dropTables() {
    return Promise.all([
      knex('chapters').del(),
      knex('lessons').del(),
      knex('users').del(),
      knex('messages').del(),
      knex('suggestions').del(),
      knex('codes').del()
    ])
    .then(() => {
      knex('users_lessons').del();
    });
  }

  function insertUsers() {
    return knex('users')
    .insert({
      github_username: 'Michael',
      github_id: 987,
      github_display_name: 'Michael Johnson',
      github_access_token: '798',
      github_avatar: 'https://avatars.io/static/default_128.jpg',
      email: 'michael@johnson.com',
      verified: false,
      admin: false
    });
  }

  function insertChapters() {
    return Promise.all([
      knex('chapters').insert({
        order_number: 1,
        name: 'Functions and Loops'
      }),
      knex('chapters').insert({
        order_number: 2,
        name: 'Conditional logic'
      }),
      knex('chapters').insert({
        order_number: 3,
        name: 'Lists and Dictionaries'
      }),
      knex('chapters').insert({
        order_number: 4,
        name: 'Inactive Chapter',
        active: false
      })
    ]);
  }

  function getChapters() {
    return knex('chapters')
    .select('*')
    .orderBy('order_number')
    .returning('*');
  }

  function insertLessons(chapters) {
    // get chapter order number
    const chapterOrder = chapters.map((chapter) => {
      return chapter.order_number;
    });
    // link lesson name to order number
    const chapterLessons = [
      {
        lessonName: 'Lesson 1a',
        lessonLessonOrder: 1,
        lessonChapterOrder: 1,
        lessonContent: '<h3>This should be an H2</h3>',
        chapterOrder: chapterOrder[0],
        lessonActive: true
      },
      {
        lessonName: 'Lesson 1b',
        lessonLessonOrder: 2,
        lessonChapterOrder: 2,
        lessonContent: 'Thundercats XOXO art party ennui, cold-pressed whatever semiotics everyday carry four loko. Microdosing celiac chia cray, church-key shabby chic you probably haven\'t heard of them skateboard everyday carry readymade. Shoreditch quinoa meh, before they sold out thundercats craft beer bespoke selvage authentic heirloom. Migas PBR&B readymade, irony literally try-hard typewriter austin butcher tattooed. Disrupt gluten-free brooklyn irony, meditation street art pug pork belly PBR&B messenger bag semiotics tousled heirloom. XOXO ennui truffaut, gentrify williamsburg flannel DIY tumblr. Celiac scenester blue bottle, meh green juice biodiesel brooklyn schlitz kitsch franzen authentic.</p>',
        chapterOrder: chapterOrder[0],
        lessonActive: true
      },
      {
        lessonName: 'Lesson 1c',
        lessonLessonOrder: 3,
        lessonChapterOrder: 3,
        lessonContent: '<p>Lomo poutine tousled, dreamcatcher marfa salvia craft beer man braid austin kogi stumptown food truck blue bottle tacos humblebrag.</p><ol><li>Fashion axe tote bag cornhole drinking vinegar.</li><li>Selfies art party banjo, pork belly paleo PBR&B wayfarers butcher.</li> <li>Gastropub crucifix artisan, salvia butcher ennui gentrify seitan irony knausgaard tofu.</li><li>Meggings fixie mlkshk locavore beard slow-carb.</ol><p>Synth tumblr salvia cliche hella, celiac whatever shoreditch four loko. VHS whatever pickled pug, sartorial you probably haven\'t heard of them bushwick disrupt food truck etsy letterpress iPhone cornhole kogi.</p>',
        chapterOrder: chapterOrder[0],
        lessonActive: true
      },
      {
        lessonName: 'Lesson 1d',
        lessonLessonOrder: 4,
        lessonChapterOrder: 4,
        lessonContent: '<a href="https://realpython.com">Lomo poutine tousled, dreamcatcher marfa salvia craft beer man braid austin kogi stumptown food truck blue bottle tacos humblebrag. Fashion axe tote bag cornhole drinking vinegar.</a><p><strong>Selfies art party banjo, pork belly paleo PBR&B wayfarers butcher. Gastropub crucifix artisan, salvia butcher ennui gentrify seitan irony knausgaard tofu. Meggings fixie mlkshk locavore beard slow-carb. Synth tumblr salvia cliche hella, celiac whatever shoreditch four loko. VHS whatever pickled pug, sartorial you probably haven\'t heard of them bushwick disrupt food truck etsy letterpress iPhone cornhole kogi.</strong>',
        chapterOrder: chapterOrder[0],
        lessonActive: false
      },
      {
        lessonName: 'Lesson 2a',
        lessonLessonOrder: 5,
        lessonChapterOrder: 1,
        lessonContent: '<p><em>90\'s kale chips butcher, twee hella kitsch ennui etsy wolf sartorial hashtag. Mixtape beard typewriter, blue bottle you probably haven\'t heard of them fingerstache VHS flannel gochujang roof party lumbersexual dreamcatcher gluten-free deep v tilde. Chartreuse next level put a bird on it seitan mixtape, 8-bit waistcoat wolf williamsburg retro single-origin coffee cray. Cold-pressed pug bespoke letterpress man braid. Occupy knausgaard artisan fixie hella fanny pack mumblecore offal, meggings viral yuccie squid 90\'s wolf brunch. Kogi butcher cred, fanny pack kale chips hella microdosing before they sold out put a bird on it listicle biodiesel DIY. Brunch tote bag semiotics knausgaard, single-origin coffee pickled cronut DIY thundercats kogi cred man bun.</p></em>',
        chapterOrder: chapterOrder[1],
        lessonActive: true
      },
      {
        lessonName: 'Lesson 3a',
        lessonLessonOrder: 6,
        lessonChapterOrder: 1,
        lessonContent: '<p>Synth ethical you probably haven\'t heard of them taxidermy, gochujang tousled banh mi blue bottle brooklyn polaroid. Ugh letterpress 8-bit, iPhone mumblecore messenger bag polaroid tote bag pug tilde irony photo booth kombucha. Godard leggings tumblr, umami franzen lo-fi pabst. Wayfarers fanny pack retro stumptown intelligentsia viral. Intelligentsia brooklyn man braid, chartreuse four dollar toast put a bird on it migas flexitarian gastropub shoreditch. Art party franzen vice, bitters chambray master cleanse taxidermy heirloom austin food truck irony scenester pop-up pickled man braid. Butcher put a bird on it pop-up irony, tote bag 90\'s roof party artisan yuccie kogi man bun banjo intelligentsia skateboard semiotics.<p>',
        chapterOrder: chapterOrder[2],
        lessonActive: true
      },
      {
        lessonName: 'Lesson 3b',
        lessonLessonOrder: 7,
        lessonChapterOrder: 2,
        lessonContent: '<p>Messenger bag cred cronut normcore. Tilde DIY tofu, meh direct trade scenester venmo craft beer bushwick forage messenger bag biodiesel.</p><br><p>Paleo skateboard quinoa keytar small batch jean shorts, freegan XOXO ugh venmo. Blog quinoa bitters biodiesel direct trade normcore.</p><br><br><p>Pork belly tote bag roof party deep v flexitarian, chambray meggings fashion axe artisan letterpress whatever taxidermy four dollar toast flannel.</p><br><br><br><p>Ennui tilde kogi cold-pressed, biodiesel plaid fashion axe. Pork belly synth migas chartreuse street art, cray thundercats before they sold out DIY.</p>',
        chapterOrder: chapterOrder[2],
        lessonActive: true
      }
    ];
    // get chapter ID from order number, add new lesson
    return Promise.all(chapterLessons.map((el) => {
      return getChapterID(el.chapterOrder, knex, Promise)
      .then((chapter) => {
        return createLesson(
          el.lessonLessonOrder,
          el.lessonChapterOrder,
          el.lessonName,
          el.lessonContent,
          chapter.id,
          el.lessonActive,
          knex,
          Promise
        );
      });
    }));
  }

  function getChapterID(chapterOrder, knex, Promise) {
    return new Promise((resolve, reject) => {
      knex('chapters')
      .select('id')
      .where('order_number', parseInt(chapterOrder))
      .then((chapter) => {
        resolve(chapter[0]);
      });
    });
  }

  function createLesson(
    lessonOrder, chapterOrder, lessonName,
    lessonContent, chapterID, lessonActive,
    knex, Promise
  ) {
    return new Promise((resolve, reject) => {
      knex('lessons')
      .insert({
        lesson_order_number: parseInt(lessonOrder),
        chapter_order_number: parseInt(chapterOrder),
        name: lessonName,
        content: lessonContent,
        chapter_id: chapterID,
        active: lessonActive
      })
      .then(() => {
        resolve();
      });
    });
  }

  function getUsers() {
    return knex('users')
    .select('*')
    .returning('*');
  }

  function getLessons() {
    return knex('lessons')
    .select('*')
    .returning('*');
  }

  function insertUsersLessons(userID, lessonID) {
    return knex('users_lessons')
    .insert({
      user_id: userID,
      lesson_id: lessonID,
      lesson_read: false
    });
  }

  function insertMessages(userID) {
    return Promise.all([
      knex('messages')
      .insert({
        content: 'Awesome lesson!',
        parent_id: null,
        lesson_id: 1,
        user_id: userID,
        created_at: new Date('2016-09-20T02:23:21.050Z'),
        updated_at: new Date('2015-09-20T02:23:21.050Z')
      })
      .returning('id'),
      knex('messages')
      .insert({
        content: 'Sick!',
        lesson_id: 1,
        parent_id: null,
        user_id: userID,
        created_at: new Date('2016-09-20T02:23:21.050Z'),
        updated_at: new Date('2015-09-20T02:23:21.050Z')
      }),
      knex('messages')
      .insert({
        content: 'Love it!',
        parent_id: null,
        lesson_id: 2,
        user_id: userID
      }),
      knex('messages')
      .insert({
        content: 'Should not be visible.',
        parent_id: null,
        lesson_id: 2,
        user_id: userID,
        active: false
      })
    ]);
  }

  function insertMessageReplies(messageID, userID) {
    return Promise.all([
      knex('messages').insert({
        content: 'Just a reply',
        parent_id: messageID,
        lesson_id: 1,
        user_id: userID
      }),
      knex('messages').insert({
        content: 'Just another reply',
        parent_id: messageID,
        lesson_id: 1,
        user_id: userID
      })
    ]);
  }

  function insertSuggestions(userID) {
    return Promise.all([
      knex('suggestions').insert({
        title: 'Test',
        description: 'Just a test',
        user_id: userID,
        created_at: new Date('2015-09-20T02:23:21.050Z')
      }).returning('id'),
      knex('suggestions').insert({
        title: 'More Python!',
        description: 'Can\'t get enough!!!',
        user_id: userID
      })
    ]);
  }

  function insertCodes() {
    return Promise.all([
      knex('codes').insert({
        verify_code: 'oGvufQsOUL7264B8M0g4J5lkr1VcyYiR'
      }),
      knex('codes').insert({
        verify_code: '6B4H498aCv33jf95NH0RIEtp3TJ725t5'
      }),
      knex('codes').insert({
        verify_code: 'n2H9KsgaT0tW5zgM23Oc22Cv00572DBE'
      }),
      knex('codes').insert({
        verify_code: 'MJLMVZwUhArep2332HD22gnc7aGp28O1'
      }),
      knex('codes').insert({
        verify_code: '7J2RQ4aYP02RiQ4717mPi3mzd9oP0tzG'
      }),
      knex('codes').insert({
        verify_code: '7Xaky5yWGpPQXO3o8Y7CCQaSvuTUVNkz'
      }),
      knex('codes').insert({
        verify_code: 'n0g9OKZw4Fb94X5992u5M0Y3kLJi7kdz'
      }),
      knex('codes').insert({
        verify_code: '1b2FIayoQvhs4xK5AJbTS7Az38YKow3M'
      }),
      knex('codes').insert({
        verify_code: '89m2ByF4XVE3jKBI4y0g4lE3imU7cmn0'
      }),
      knex('codes').insert({
        verify_code: 'dtGnT0oHDDlPl7HVOY9JFY0gvJy5Yaq7'
      })
    ]);
  }

  module.exports = {
    dropTables,
    insertUsers,
    insertChapters,
    getChapters,
    insertLessons,
    getUsers,
    getLessons,
    insertUsersLessons,
    insertMessages,
    insertMessageReplies,
    insertSuggestions,
    insertCodes
  };

}());
