var path = require('path');
var gulp = require('gulp');
var fiberglass = require('fiberglass');

fiberglass.tasks(gulp, path.join(__dirname, '..'))
.setOptions({
  browserify: {
    noParse: [
      require.resolve('viz.js')
    ]
  }
})
.addBundleTasks(
  'copy-viz'
)
.register(
  ''
);
