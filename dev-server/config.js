const path = require('path');
const paths = {
  public: path.resolve(__dirname, '../docs'),
  build: path.resolve(__dirname, '../docs/build'),
  src: path.resolve(__dirname, '../src')
};
const config = {
  paths: paths,
  devMode: process.env.NODE_ENV !== 'production',
  host: process.env.DEV_SERVER_HOST || 'localhost',
  port: process.env.DEV_SERVER_PORT || 8017,
  useHttps: /false/i.test(process.env.DEV_SERVER_NOHTTPS)
};
config.url = 'http' + (config.useHttps ? 's' : '') +
  '://' + config.host + ':' + config.port + '/';

module.exports = config;
