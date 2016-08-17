(function (routeConfig) {

  routeConfig.init = function (app) {

    // *** routes *** //
    var routes = require('../routes/index');
    var contactRoutes = require('../routes/contact');
    var authRoutes = require('../routes/auth');
    var chapterRoutes = require('../routes/chapters');
    var lessonRoutes = require('../routes/lessons');
    var userRoutes = require('../routes/users');
    var messageRoutes = require('../routes/messages');
    var searchRoutes = require('../routes/search');
    var suggestionRoutes = require('../routes/suggestion');

    // *** admin routes *** //
    var adminUserRoutes = require('../routes/admin/admin.users');
    var adminMessageRoutes = require('../routes/admin/admin.messages');
    var adminChapterRoutes = require('../routes/admin/admin.chapters');
    var adminLessonRoutes = require('../routes/admin/admin.lessons');
    var adminAuthRoutes = require('../routes/admin/admin.auth');

    // *** register routes *** //
    app.use('/', routes);
    app.use('/contact', contactRoutes);
    app.use('/auth', authRoutes);
    app.use('/chapters', chapterRoutes);
    app.use('/lessons', lessonRoutes);
    app.use('/users', userRoutes);
    app.use('/messages', messageRoutes);
    app.use('/search', searchRoutes);
    app.use('/suggestions', suggestionRoutes);
    app.use('/admin/users', adminUserRoutes);
    app.use('/admin/messages', adminMessageRoutes);
    app.use('/admin/chapters', adminChapterRoutes);
    app.use('/admin/lessons', adminLessonRoutes);
    app.use('/admin/auth', adminAuthRoutes);

  };

})(module.exports);
