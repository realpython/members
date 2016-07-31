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
        lessonContent: '# Markdown test',
        lessonRead: false,
        chapterOrder: chapterOrder[0],
        lessonActive: true
      },
      {
        lessonName: 'Lesson 1b',
        lessonLessonOrder: 2,
        lessonChapterOrder: 2,
        lessonContent: 'Thundercats XOXO art party ennui, cold-pressed whatever semiotics everyday carry four loko. Microdosing celiac chia cray, church-key shabby chic you probably haven\'t heard of them skateboard everyday carry readymade. Shoreditch quinoa meh, before they sold out thundercats craft beer bespoke selvage authentic heirloom. Migas PBR&B readymade, irony literally try-hard typewriter austin butcher tattooed. Disrupt gluten-free brooklyn irony, meditation street art pug pork belly PBR&B messenger bag semiotics tousled heirloom. XOXO ennui truffaut, gentrify williamsburg flannel DIY tumblr. Celiac scenester blue bottle, meh green juice biodiesel brooklyn schlitz kitsch franzen authentic.',
        lessonRead: false,
        chapterOrder: chapterOrder[0],
        lessonActive: true
      },
      {
        lessonName: 'Lesson 1c',
        lessonLessonOrder: 3,
        lessonChapterOrder: 3,
        lessonContent: 'Lomo poutine tousled, dreamcatcher marfa salvia craft beer man braid austin kogi stumptown food truck blue bottle tacos humblebrag. Fashion axe tote bag cornhole drinking vinegar. Selfies art party banjo, pork belly paleo PBR&B wayfarers butcher. Gastropub crucifix artisan, salvia butcher ennui gentrify seitan irony knausgaard tofu. Meggings fixie mlkshk locavore beard slow-carb. Synth tumblr salvia cliche hella, celiac whatever shoreditch four loko. VHS whatever pickled pug, sartorial you probably haven\'t heard of them bushwick disrupt food truck etsy letterpress iPhone cornhole kogi.',
        lessonRead: false,
        chapterOrder: chapterOrder[0],
        lessonActive: true
      },
      {
        lessonName: 'Lesson 1d',
        lessonLessonOrder: 4,
        lessonChapterOrder: 4,
        lessonContent: 'Lomo poutine tousled, dreamcatcher marfa salvia craft beer man braid austin kogi stumptown food truck blue bottle tacos humblebrag. Fashion axe tote bag cornhole drinking vinegar. Selfies art party banjo, pork belly paleo PBR&B wayfarers butcher. Gastropub crucifix artisan, salvia butcher ennui gentrify seitan irony knausgaard tofu. Meggings fixie mlkshk locavore beard slow-carb. Synth tumblr salvia cliche hella, celiac whatever shoreditch four loko. VHS whatever pickled pug, sartorial you probably haven\'t heard of them bushwick disrupt food truck etsy letterpress iPhone cornhole kogi.',
        lessonRead: false,
        chapterOrder: chapterOrder[0],
        lessonActive: false
      },
      {
        lessonName: 'Lesson 2a',
        lessonLessonOrder: 5,
        lessonChapterOrder: 1,
        lessonContent: '90\'s kale chips butcher, twee hella kitsch ennui etsy wolf sartorial hashtag. Mixtape beard typewriter, blue bottle you probably haven\'t heard of them fingerstache VHS flannel gochujang roof party lumbersexual dreamcatcher gluten-free deep v tilde. Chartreuse next level put a bird on it seitan mixtape, 8-bit waistcoat wolf williamsburg retro single-origin coffee cray. Cold-pressed pug bespoke letterpress man braid. Occupy knausgaard artisan fixie hella fanny pack mumblecore offal, meggings viral yuccie squid 90\'s wolf brunch. Kogi butcher cred, fanny pack kale chips hella microdosing before they sold out put a bird on it listicle biodiesel DIY. Brunch tote bag semiotics knausgaard, single-origin coffee pickled cronut DIY thundercats kogi cred man bun.',
        lessonRead: false,
        chapterOrder: chapterOrder[1],
        lessonActive: true
      },
      {
        lessonName: 'Lesson 3a',
        lessonLessonOrder: 6,
        lessonChapterOrder: 1,
        lessonContent: 'Synth ethical you probably haven\'t heard of them taxidermy, gochujang tousled banh mi blue bottle brooklyn polaroid. Ugh letterpress 8-bit, iPhone mumblecore messenger bag polaroid tote bag pug tilde irony photo booth kombucha. Godard leggings tumblr, umami franzen lo-fi pabst. Wayfarers fanny pack retro stumptown intelligentsia viral. Intelligentsia brooklyn man braid, chartreuse four dollar toast put a bird on it migas flexitarian gastropub shoreditch. Art party franzen vice, bitters chambray master cleanse taxidermy heirloom austin food truck irony scenester pop-up pickled man braid. Butcher put a bird on it pop-up irony, tote bag 90\'s roof party artisan yuccie kogi man bun banjo intelligentsia skateboard semiotics.',
        lessonRead: false,
        chapterOrder: chapterOrder[2],
        lessonActive: true
      },
      {
        lessonName: 'Lesson 3b',
        lessonLessonOrder: 7,
        lessonChapterOrder: 2,
        lessonContent: 'Messenger bag cred cronut normcore. Tilde DIY tofu, meh direct trade scenester venmo craft beer bushwick forage messenger bag biodiesel. Paleo skateboard quinoa keytar small batch jean shorts, freegan XOXO ugh venmo. Blog quinoa bitters biodiesel direct trade normcore. Pork belly tote bag roof party deep v flexitarian, chambray meggings fashion axe artisan letterpress whatever taxidermy four dollar toast flannel. Ennui tilde kogi cold-pressed, biodiesel plaid fashion axe. Pork belly synth migas chartreuse street art, cray thundercats before they sold out DIY.',
        lessonRead: false,
        chapterOrder: chapterOrder[2],
        lessonActive: true
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
          el.lessonActive,
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
  lessonActive, knex, Promise
) {
  return new Promise(function(resolve, reject) {
    knex('lessons')
      .insert({
        lesson_order_number: parseInt(lessonOrder),
        chapter_order_number: parseInt(chapterOrder),
        name: lessonName,
        content: lessonContent,
        read: lessonRead,
        chapter_id: chapterID,
        active: lessonActive
      })
      .then(function() {
        resolve();
      });
  });
}
