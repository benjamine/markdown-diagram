require('babel-register');
require('./safe-babel-polyfill');

// global exports

exports.generate = require('./generator').generate;
exports.ajax = require('./ajax').default;
exports.load = require('./load').default;
