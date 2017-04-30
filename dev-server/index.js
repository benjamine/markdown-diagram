'use strict';

require('babel-register');
require('../src/safe-babel-polyfill');

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const express = require('express');
const app = express();

const webpackConfig = require('../webpack.config');
const config = require('./config');

const webpackCompiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(webpackCompiler, {
  publicPath: webpackConfig.output.publicPath,
  contentBase: config.paths.public,
  noInfo: true,
  // hot: true,
  https: config.useHttps,
  // key: fs.readFileSync(path.join(__dirname, 'key.pem'), 'utf8'),
  // cert: fs.readFileSync(path.join(__dirname, 'server.crt'), 'utf8'),
  historyApiFallback: true
}));

app.use(express.static(config.paths.public));

let server;
if (config.useHttps) {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem'), 'utf8'),
    cert: fs.readFileSync(path.join(__dirname, 'server.crt'), 'utf8')
  };
  server = https.createServer(httpsOptions, app);
} else {
  server = http.createServer(app);
}

server.listen(config.port, config.host, function(err, result) {
  if (err) {
    return console.log(err);
  }
  console.log('Listening at ' + config.url);
});
