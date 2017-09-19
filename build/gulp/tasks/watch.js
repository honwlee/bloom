var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    util = require('../utils'),
    src = [
        util.assetSrc + 'stylesheets/sass/**/*.scss'
    ];

module.exports = function() {
    livereload.listen({
        port: 35729,
        start: true
    });
    gutil.log('The env is : ', gutil.colors.magenta((util.isProd()) ? '"prod"' : '"dev"'));
    // connect.server({
    //     port: 5000,
    //     root: util.dest
    // });
    gulp.watch(src, ['sass']);

};
