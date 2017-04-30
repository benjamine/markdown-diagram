const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config');
const config = require('./config');

new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  contentBase: config.paths.public,
  noInfo: true,
  hot: true,
  https: config.useHttps,
  // key: fs.readFileSync(path.join(__dirname, 'key.pem'), 'utf8'),
  // cert: fs.readFileSync(path.join(__dirname, 'server.crt'), 'utf8'),
  historyApiFallback: true
}).listen(config.port, config.host, function(err, result) {
  if (err) {
    return console.log(err);
  }
  console.log('Listening at ' + config.url);
});
