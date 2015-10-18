var gulp    = require('gulp');
var shell   = require('gulp-shell');
var nodemon = require('gulp-nodemon');

// run mocha tests
gulp.task('t', shell.task(['mocha "tests/**/*.js" --reporter spec']));

// DEBUG mocha tests
gulp.task('td', shell.task(['mocha "tests/**/*.js"  --debug-brk --reporter spec']));
