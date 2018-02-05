const gulp = require('gulp'),
  sass = require('gulp-sass'),
  concatCss = require('gulp-concat-css'),
  browserSync = require('browser-sync').create();

const paths = {
  styles: ['src/scss/**/*.scss'],
  scripts: ['src/js/**/*.js'],
  index: ['public/index.html']
};

gulp.task('copy-js', function() {
  return gulp.src(paths.scripts)
    .pipe(gulp.dest('public/js/'));
});

gulp.task('js-watch', ['copy-js'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('sass', function() {
  return gulp.src(paths.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('public/css/'))
    .pipe(browserSync.stream());
});

gulp.task('dev', ['sass'], function() {

  browserSync.init({
    server: 'public/'
  });

  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.scripts, ['js-watch']);
  gulp.watch(paths.index).on('change', browserSync.reload);
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['js-watch']);
  gulp.watch(paths.styles, ['sass']);
});

gulp.task('build', ['copy-js', 'sass']);

gulp.task('default', ['dev']);
