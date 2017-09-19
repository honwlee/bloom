var gulp = require('gulp'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    header = require('gulp-header'),
    livereload = require('gulp-livereload'),
    sourceMaps = require('gulp-sourcemaps'),
    amdOptimize = require('gulp-amd-optimizer'),
    uglify = require('gulp-uglify'),
    onError = require('../utils/handleErrors'),
    util = require('../utils');


var src = [util.allinoneFile];
var dest = util.assetDest + 'js';

var requireConfig = {
    baseUrl: util.src,
    paths: {
        "script": "./script",
        "skylark": "./lib/skylark",
        "skylarkx": "./lib/skylarkx"
    },
    include: [
        util.allinone
    ]
};

var options = {
    umd: false
};

module.exports = function() {
    return gulp.src(src)
        .pipe(amdOptimize(requireConfig, options))
        .on('error', onError)
        .pipe(concat(util.allinone + ".js"))
        .pipe(util.isProd() ? uglify() : gutil.noop())
        .pipe(util.isProd() ? header(util.banner, {
            pkg: util.pkg
        }) : gutil.noop())
        .pipe(gulp.dest(dest))
        .pipe(util.isProd() ? gutil.noop() : livereload());
};
