module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['mocha'],
    files: [
      'public/build/viz.js',
      'public/build/markdown-diagram.js',
      'public/build/test-bundle.js'
    ],
    reporters : ['spec', 'growler']
  });
};
