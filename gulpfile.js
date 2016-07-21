var gulp    = require('gulp');
var shell   = require('gulp-shell');
var nodemon = require('gulp-nodemon');

// run mocha tests
gulp.task('t', shell.task(['']));

// DEBUG mocha tests
gulp.task('td', shell.task(['']));
