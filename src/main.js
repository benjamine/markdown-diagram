
// global exports

exports.generate = require('./generator').generate;
exports.ajax = require('./ajax');
exports.load = require('./load');

if (process.browser) {
  // exports only for browser bundle
  exports.version = '{{package-version}}';
  exports.homepage = '{{package-homepage}}';
} else {
  // exports only for node.js
  var packageInfo = require('../pack' + 'age.json');
  exports.version = packageInfo.version;
  exports.homepage = packageInfo.homepage;
}
