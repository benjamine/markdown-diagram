var gulp = require('gulp');
var newer = require('gulp-newer');
var wrap = require("gulp-wrap");

gulp.task('copy-viz', function() {
  return gulp.src([
      './node_modules/viz.js/viz.js'
    ])
    .pipe(wrap('(function(){ var module={exports:{}};\n<%= contents %>\n;\nwindow.Viz=module.exports;})();'))
    .pipe(newer({
      dest: './public/build'
    }))
    .pipe(gulp.dest('./public/build'));
});
