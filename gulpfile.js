var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssdeclsort = require('css-declaration-sorter');
var autoprefixer = require('autoprefixer');
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync').create();

gulp.task('styles', function() {
  return gulp.src('style.scss')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(postcss([cssdeclsort({order: 'smacss'})]))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('.'))
		.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src('app.js')
    .pipe(browserSync.stream());
});

gulp.task('lint', function() {
  return gulp.src('app.js')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(plumber.stop())
});

gulp.task('default', ['styles', 'scripts', 'lint'], function() {
  gulp.watch('index.html').on('change', browserSync.reload);
  gulp.watch('style.scss', ['styles']);
  gulp.watch('app.js', ['scripts', 'lint']);
  browserSync.init({
  	server: {
    	baseDir: './'
    }   
  }); 
});
