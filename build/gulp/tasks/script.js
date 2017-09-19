var gulp = require('gulp'),
    gutil = require('gulp-util'),
    header = require('gulp-header'),
    livereload = require('gulp-livereload'),
    sourceMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    onError = require('../utils/handleErrors'),
    util = require('../utils');


var src = [util.src + '**/*.js'];

var dest = util.assetDest + 'js';

module.exports = function() {
    gulp.src(util.src + '**//*.html')
        .pipe(gulp.dest(dest));
    gulp.src(util.src + '**//*.css')
        .pipe(gulp.dest(dest));
    gulp.src(util.src + '**//*.json')
        .pipe(gulp.dest(dest));
    gulp.src(util.src + '**//*.(png|jpg|jpeg|gif)')
        .pipe(gulp.dest(dest));
    return gulp.src(src)
        .pipe(util.isProd() ? sourceMaps.init() : gutil.noop())
        .on('error', onError)
        .pipe(util.isProd() ? sourceMaps.write() : gutil.noop())
        .pipe(util.isProd() ? uglify() : gutil.noop())
        .on('error', onError)
        .pipe(util.isProd() ? header(util.banner, {
            pkg: util.pkg
        }) : gutil.noop())
        .pipe(gulp.dest(dest))
        .pipe(util.isProd() ? gutil.noop() : livereload());
};
