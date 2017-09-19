var gulp = require('gulp');

module.exports = function() {
    gulp.start('clean', 'script', 'minify');
};
