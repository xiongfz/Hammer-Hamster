'use strict';

// where the index.js is.
let __entryPath = __dirname + '/public/entry.js';
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let path = require('path');
let isProduction = process.argv.indexOf('--production') > -1;

let webpackConfig = {
  context: path.join(__dirname, '/lib'),
  entry: {
    'app': './app.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: "react-hot!babel-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.min\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      {
        test: /(?!.*\.min)^.*\.css$/,
        loaders: ['style', 'css-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url?limit=1024&name=img/[name].[ext]'
      },
      {
        test: /\.(woff2?|otf|eot|svg|ttf)$/i,
        loader: 'url?name=fonts/[name].[ext]'
      },
      {
        loader: 'json-loader',
        test: /\.json$/
      }
    ]
  },
  resolve: {
    // put '' after '.ts' to make webpack resolve '*.scss.ts' not '*.scss'
    extensions: ['.jsx', '.js', ''],
    modulesDirectories: [
      '',
      'node_modules',
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Yezi',
    }),
    new ExtractTextPlugin("styles.css")
  ]
};

if (isProduction) {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
      warnings: false
    }
  }));
}

module.exports = webpackConfig;
