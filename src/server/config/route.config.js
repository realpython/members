((routeConfig) => {

  routeConfig.init = (app) => {

    // *** routes *** //
    const routes = require('../routes/index');
    const contactRoutes = require('../routes/contact');
    const authRoutes = require('../routes/auth');
    const chapterRoutes = require('../routes/chapters');
    const lessonRoutes = require('../routes/lessons');
    const userRoutes = require('../routes/users');
    const messageRoutes = require('../routes/messages');
    const searchRoutes = require('../routes/search');
    const suggestionRoutes = require('../routes/suggestion');

    // *** admin routes *** //
    const adminUserRoutes = require('../routes/admin/admin.users');
    const adminMessageRoutes = require('../routes/admin/admin.messages');
    const adminChapterRoutes = require('../routes/admin/admin.chapters');
    const adminLessonRoutes = require('../routes/admin/admin.lessons');
    const adminAuthRoutes = require('../routes/admin/admin.auth');

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
