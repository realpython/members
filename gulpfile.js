// *** dependencies *** //

var gulp = require('gulp');
var rimraf = require('rimraf');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var path = require('path');
var nodemon = require('gulp-nodemon');

// *** config *** //

var paths = {
  styles: './src/client/css/*.css',
  scripts: './src/client/js/*.js',
  buildDirectory: './build',
  buildServer: './build/server/bin/www',
  sourceServer: './src/server/bin/www'
};

var nodemonBuildConfig = {
  script: paths.buildServer,
  ext: 'html js css',
  ignore: ['node_modules'],
  env: {
    NODE_ENV: 'development'
  }
};

var nodemonSourceConfig = {
  script: paths.sourceServer,
  ext: 'html js css',
  ignore: ['node_modules'],
  env: {
    NODE_ENV: 'development'
  }
};

// *** default *** //

gulp.task('default', function() {
  runSequence(
    ['nodemonSource']
  );
});

// *** create build for deployment *** //

gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['minify-css'],
    ['minify-js'],
    ['copy-server-files'],
    ['copy-tests'],
    ['nodemonBuild']
  );
});

// *** sub tasks ** //

gulp.task('clean', function (cb) {
  rimraf(paths.buildDirectory, cb);
});

gulp.task('minify-css', function() {
  var opts = {keepSpecialComments:'*'};
  return gulp.src(paths.styles)
    .pipe(cleanCSS({debug: true}))
    .pipe(gulp.dest(path.join(
      __dirname,
      paths.buildDirectory,
      '/client/css/'
    )));
});

gulp.task('minify-js', function() {
  gulp.src(paths.scripts)
    // .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.join(
      __dirname,
      paths.buildDirectory,
      '/client/js/'
    )));
});

gulp.task('copy-server-files', function () {
  gulp.src('./src/server/**/*')
    .pipe(gulp.dest('./build/server/'));
});

gulp.task('copy-tests', function () {
  gulp.src('./src/test/**/*')
    .pipe(gulp.dest('./build/test/'));
});

gulp.task('nodemonBuild', function () {
  return nodemon(nodemonBuildConfig);
});

gulp.task('nodemonSource', function () {
  return nodemon(nodemonSourceConfig);
});
