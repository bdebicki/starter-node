// require gulp
var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    symlink = require('gulp-symlink'),
    del = require('del'),
    public = './public/',
    lessPackageFile = './src/less/application.less',
    lessFiles = './src/less/**/*.less',
    lessFileDest = './public/css/',
    jsFilesList = [],
    jsFiles = './src/js/**/*.js',
    jsFileDest = './public/js/',
    jspackageFile = 'application.js',
    symlinkSrcList = ['./src/fonts',
                    './src/images',
                    './src/views/index.html'],
    symlinkDestList = ['./public/fonts',
                     './public/images',
                     './public/index.html'];

// remove public folder
gulp.task('clean:public', function () {
    return del(public);
});

// build css file task
gulp.task('less', function() {
    return gulp.src(lessPackageFile)
               .pipe(less())
               .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 10'] }))
               .pipe(gulp.dest(lessFileDest));
});

// build minified css file task
gulp.task('less:minify', function() {
    return gulp.src(lessPackageFile)
               .pipe(less())
               .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 10'] }))
               .pipe(minify())
               .pipe(gulp.dest(lessFileDest));
});

// build js file task
gulp.task('js', function() {
    return gulp.src(jsFilesList)
               .pipe(concat(jspackageFile))
               .pipe(gulp.dest(jsFileDest));
});

// build minified js file task
gulp.task('js:minify', function() {
    return gulp.src(jsFilesList)
               .pipe(concat(jspackageFile))
               .pipe(uglify())
               .pipe(gulp.dest(jsFileDest));
});

// css watch task
gulp.task('watch:less', function() {
    return gulp.watch(lessFiles, ['less'])
});

// js watch task
gulp.task('watch:js', function() {
    return gulp.watch(jsFiles, ['js'])
});

// global watch task
gulp.task('watch', ['watch:less', 'watch:js'], function () {});

// global build task
gulp.task('build', ['clean:public', 'less', 'js'], function () {
    return gulp.src(symlinkSrcList)
               .pipe(symlink(symlinkDestList));
});

// global build minified task
gulp.task('build:minify', ['clean:public', 'less:minify', 'js:minify'], function () {
    return gulp.src(symlinkSrcList)
               .pipe(symlink(symlinkDestList));
});