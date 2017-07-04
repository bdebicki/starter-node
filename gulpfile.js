// require gulp
var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babel = require('babelify');
var symlink = require('gulp-sym');
var del = require('del');

var publicFolder = './public/';
var srcFolder = './src/';
var cssDestFolder = publicFolder + 'css/';
var lessSrcPackageFiles = srcFolder + 'less/*.less';
var lessSrcFiles = srcFolder + 'less/**/*.less';
var jsPackageFile = 'application.js';
var jsDestFolder = publicFolder + 'js/';
var jsSrcFiles = srcFolder + 'js/**/*.js';
var jsSrcPackageFile = srcFolder + 'js/' + jsPackageFile;
var symlinkSrcList = [srcFolder + 'fonts',
                      srcFolder + 'images',
                      srcFolder + 'views/index.html'];
var symlinkDestList = [publicFolder + 'fonts',
                       publicFolder + 'images',
                       publicFolder + 'index.html'];

var bundler = browserify(jsSrcPackageFile, { debug: true })
                .transform(babel.configure({
                    presets: ["es2015"],
                    plugins: ["transform-decorators-legacy"]
                }));

// remove public folder
gulp.task('clean:public', function () {
    return del(publicFolder);
});

// build css file task
gulp.task('less', function() {
    return gulp.src(lessSrcPackageFiles)
               .on('error', function(error) { console.log(error.toString()); this.emit('end'); })
               .pipe(less())
               .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 10'] }))
               .pipe(gulp.dest(cssDestFolder));
});

// build minified css file task
gulp.task('less:minify', function() {
    return gulp.src(lessSrcPackageFiles)
	           .on('error', function(error) { console.log(error.toString()); this.emit('end'); })
               .pipe(less())
               .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 10'] }))
               .pipe(cleanCss())
               .pipe(gulp.dest(cssDestFolder));
});

// build js file task
gulp.task('js', function() {
    bundler.bundle()
           .on('error', function(error) { console.log(error.toString()); this.emit('end'); })
           .pipe(source(jsPackageFile))
           .pipe(buffer())
           .pipe(gulp.dest(jsDestFolder));
});

// build minified js file task
gulp.task('js:minify', function() {
    bundler.bundle()
           .on('error', function(error) { console.log(error.toString()); this.emit('end'); })
           .pipe(source(jsPackageFile))
           .pipe(buffer())
           .pipe(uglify())
           .pipe(gulp.dest(jsDestFolder));
});

// css watch task
gulp.task('watch:less', function() {
    return gulp.watch(lessSrcFiles, ['less'])
});

// js watch task
gulp.task('watch:js', function() {
    return gulp.watch(jsSrcFiles, ['js'])
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