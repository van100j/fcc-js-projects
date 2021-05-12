var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client/dist');
var APP_DIR = path.resolve(__dirname, 'client');

var config = {
  /*devtool: 'cheap-module-eval-source-map',*/
  entry: [
      APP_DIR + '/index.js'
  ],
  output: {
    path: BUILD_DIR,
    publicPath: '/static/',
    filename: 'bundle.js'
  },
  plugins: [
    /*new webpack.HotModuleReplacementPlugin(),*/
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module : {
    loaders : [{
      test : /\.jsx?/,
      include : APP_DIR,
      loader : 'babel',
      query: {
        presets : ["es2015", "react", "stage-0"]
      }
    }]
  }
};

module.exports = config;
