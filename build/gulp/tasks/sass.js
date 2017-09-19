'use strict';

var util = require('../utils');
var sourcemaps = require('gulp-sourcemaps');
var gulp = require('gulp');
var sass = require('gulp-sass');

var src = [util.assetSrc + 'stylesheets/sass/**/*.scss'];
console.log(src[0]);
var dist = [util.assetDest + "css", util.assetSrc + "stylesheets"];
module.exports = function() {
    return gulp.task('sass', function() {
        var build = gulp.src(src)
            .pipe(sourcemaps.init())
            .pipe(sass({
                includePaths: require('node-bourbon').includePaths
                // outputStyle: 'compressed'
            }).on('error', sass.logError))
            .pipe(sourcemaps.write());
        dist.forEach(function(dest) {
            build.pipe(gulp.dest(dest));
        });
    });
};
