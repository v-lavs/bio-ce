'use strict';

const gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    include = require('gulp-include'),
    dartSass = require('sass'),
    sass = require('gulp-sass')(dartSass),
    gcmq = require('gulp-group-css-media-queries'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    { promisify } = require('util'),
    rimraf = require('rimraf');

const rimrafAsync = promisify(rimraf);

const path = {
    build: {
        js: './dist/',
        css: './dist/'
    },
    src: {
        js: './src/js/main.js',
        style: './src/scss/main.scss'
    },
    watch: {
        js: './src/js/**/*.js',
        style: './src/scss/**/*.scss'
    },
    clean: './dist'
};

// Error handler
function handleError(err) {
    console.error(err.toString());
    this.emit('end');
}

// Clean task
function clean() {
    return rimrafAsync(path.clean);
}

// JavaScript development task
function jsDev() {
    return gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(include({ extensions: 'js', hardFail: true }))
        .on('error', handleError)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.js));
}

// JavaScript build task
function jsBuild() {
    return gulp.src(path.src.js)
        .pipe(include({ extensions: 'js', hardFail: true }))
        .on('error', handleError)
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
}

// Styles development task
function styleDev() {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({ sourceMap: true, errLogToConsole: true }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(gcmq())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.css));
}

// Styles build task
function styleBuild() {
    return gulp.src(path.src.style)
        .pipe(sass({ sourceMap: false, errLogToConsole: true }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(gcmq())
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.build.css));
}

// Watch tasks
function watchStyles() {
    gulp.watch(path.watch.style, styleDev);
}

function watchJs() {
    gulp.watch(path.watch.js, jsDev);
}

// Build and development tasks
const build = gulp.series(clean, gulp.parallel(jsBuild, styleBuild));
const dev = gulp.series(clean, gulp.parallel(jsDev, styleDev));
const watch = gulp.parallel(watchStyles, watchJs);

// Register tasks
gulp.task('clean', clean);
gulp.task('build', build);
gulp.task('dev', dev);
gulp.task('watch', watch);
gulp.task('default', gulp.series(dev, watch));
