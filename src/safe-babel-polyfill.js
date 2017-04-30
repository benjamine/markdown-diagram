// loads babel-polyfill only if it hasn't been loaded yet
/* eslint-disable fp/no-unused-expression */
if (typeof window !== 'undefined') {
  if (!window._babelPolyfill) {
    require('babel-polyfill');
  }
} else if (typeof global !== 'undefined') {
  if (!global._babelPolyfill) {
    require('babel-polyfill');
  }
} else {
  require('babel-polyfill');
}
