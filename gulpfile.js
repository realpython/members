// *** dependencies *** //

var gulp = require('gulp-help')(require('gulp'));
var rimraf = require('rimraf');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var path = require('path');
var nodemon = require('gulp-nodemon');
var shell = require('gulp-shell');

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

// *** run dev server from 'src' *** //

gulp.task('default', 'Run development server from "src"', function() {
  runSequence(
    ['nodemonSource']
  );
});

// *** create build, run tests *** //

gulp.task('test', 'Create build, run tests from "build"', function() {
  runSequence(
    ['clean'],
    ['minify-css'],
    ['minify-js'],
    ['copy-server-files'],
    ['copy-tests'],
    ['run-tests']
  );
});

// *** create build, run tests with coverage *** //

gulp.task('coverage', 'Create build, run tests with coverage from "build"',
function() {
  runSequence(
    ['clean'],
    ['minify-css'],
    ['minify-js'],
    ['copy-server-files'],
    ['copy-tests'],
    ['run-coverage']
  );
});

// *** create build for deployment *** //

gulp.task('build', 'Create build for deployment', function() {
  runSequence(
    ['clean'],
    ['minify-css'],
    ['minify-js'],
    ['copy-server-files'],
    ['copy-tests']
  );
});

// *** sub tasks ** //

gulp.task('clean', false, function(cb) {
  rimraf(paths.buildDirectory, cb);
});

gulp.task('minify-css', false, function() {
  var opts = {keepSpecialComments:'*'};
  return gulp.src(paths.styles)
    .pipe(cleanCSS({debug: true}))
    .pipe(gulp.dest(path.join(
      __dirname,
      paths.buildDirectory,
      '/client/css/'
    )));
});

gulp.task('minify-js', false, function() {
  gulp.src(paths.scripts)
    // .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.join(
      __dirname,
      paths.buildDirectory,
      '/client/js/'
    )));
});

gulp.task('copy-server-files', false, function() {
  gulp.src('./src/server/**/*')
    .pipe(gulp.dest('./build/server/'));
});

gulp.task('copy-tests', false, function() {
  gulp.src('./src/test/**/*')
    .pipe(gulp.dest('./build/test/'));
});

gulp.task('nodemonBuild', false, function() {
  return nodemon(nodemonBuildConfig);
});

gulp.task('nodemonSource', false, function() {
  return nodemon(nodemonSourceConfig);
});

gulp.task('run-tests', false, shell.task([
  'npm run test-build'
]));

gulp.task('run-coverage', false, shell.task([
  'npm run coverage'
]));
