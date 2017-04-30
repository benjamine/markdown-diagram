const webpack = require('webpack');
const Visualizer = require('webpack-visualizer-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const _ = require('lodash');

const serverConfig = require('./dev-server/config');
const devMode = serverConfig.devMode;
const paths = serverConfig.paths;
const packageInfo = require('./package.json');

const config = {
  entry: {
    main: _.compact([
      paths.src + '/main.js'
    ])
  },
  resolve: {
    extensions: ['*', '.js', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        include: paths.src,
        loaders: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(eot|svg|ttf|svg|jpg|gif|png|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url-loader',
        query: {
          limit: 10 * 1024 // bundle data-uris for assets < 10KB
        }
      },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  externals: [
    { 'viz.js': true }
  ],
  plugins: _.compact([
    new CopyWebpackPlugin([
      { from: 'node_modules/viz.js/viz.js' }
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.resource)
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"' + (process.env.NODE_ENV || 'development') + '"'
      }
    }),
    devMode
      ? null
      : new webpack.optimize.UglifyJsPlugin({
        exclude: [/vendor/],
        compress: {
          warnings: false
        }
      }),
    devMode ? null : new Visualizer({
      filename: '../../docs/build/bundle-stats.html'
    })
  ]),
  devtool: devMode ? 'inline-source-map' : 'cheap-module-source-map',
  output: {
    path: paths.build,
    filename: packageInfo.name + '.[name].js',
    publicPath: serverConfig.url + 'build/',

    libraryTarget: 'umd',
    library: _.camelCase(packageInfo.name)

  }
};

module.exports = config;
