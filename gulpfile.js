/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify-es').default;
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');

gulp.task('default', ['copy-html', 'copy-images', 'copy-manifest', 'styles', 'lint', 'scripts'], function() {
  gulp.watch('sass/**/*.scss', ['styles']);
  gulp.watch('js/**/*.js', ['lint']);
  gulp.watch('/*.html', ['copy-html']);
  gulp.watch('./dist/*.html').on('change', browserSync.reload);

  browserSync.init({
    server: './dist'
  });
});

gulp.task('dist', [
  'copy-html',
  'copy-images',
  'copy-manifest',
  'styles',
  'lint',
  'scripts-dist'
]);

gulp.task('scripts', function() {
  gulp.src('js/**/*.js')
    .pipe(gulp.dest('dist/js'));
  gulp.src('sw.js')
    .pipe(gulp.dest('dist/'));
});

gulp.task('scripts-dist', function() {
  gulp.src('js/**/*.js')
    .pipe(gulp.dest('dist/js'));
  gulp.src('sw.js')
    .pipe(gulp.dest('dist/'));
});

gulp.task('scripts-lint', function() {
  gulp.src('js/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
  gulp.src('sw.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('scripts-test', function() {
  gulp.src('js/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('dist/js'));
  gulp.src('sw.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy-html', function() {
  gulp.src('./*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
  gulp.src('img/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-manifest', function() {
  gulp.src('./*.json')
    .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function() {
  gulp.src('sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('lint', function () {
  return gulp.src(['js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', ['dist']);

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      host: 'localhost',
      port: 8000,
      livereload: true,
      open: true,
    }));
});