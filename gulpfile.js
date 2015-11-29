/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
watch = require('gulp-watch'),
gutil = require('gulp-util'),
jshint = require('gulp-jshint'),
rename = require('gulp-rename'),
uglify = require('gulp-uglify');

var handleError = function (error) {
  // details of the error in the console
  gutil.log(error.toString());
  this.emit('end');
}

// configure the jshint task
gulp.task('sanitize', function() {
  return gulp.src('jquery.slimscroll.js')
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('compress',['sanitize'], function() {
  return gulp.src('jquery.slimscroll.js')
  // .pipe(jshint())
  // .pipe(jshint.reporter('jshint-stylish'))
  .pipe(uglify().on('error', handleError))
  .pipe(rename({
    extname: ".min.js"
  }))
  .pipe(gulp.dest('./'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['compress'], function() {
  watch('jquery.slimscroll.js', function() {
    gulp.start('compress');
  });
});

// define the default task and add the watch task to it
gulp.task('default', ['watch']);
