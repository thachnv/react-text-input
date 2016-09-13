var path = require('path');
var pkg = require('./package.json');
var util = require('util');
var webpack = require('webpack');
// require('dotenv').config({ silent: true });
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var isDevMode = process.env.NODE_ENV === 'development';


const configKeys = Object.keys(process.env);
var configs = {};

for (var i = 0; i< configKeys.length; i++) {
  var key = configKeys[i];
  configs[key] = process.env[key];
}

var plugins = [];
var cssLoader;
var jsLoaders = [];
var htmlLoader = [
  'file-loader?name=[path][name].[ext]',
  'template-html-loader?' + [
    'raw=true',
    'engine=lodash',
    'version=' + pkg.version,
    'title=' + pkg.name,
  ].join('&')
].join('!');

if (isDevMode) {
  // jsLoaders.push('react-hot');
  cssLoader = [
    'style-loader',
    'css-loader?sourceMap&localIdentName=[name]__[local]___[hash:base64:5]',
    // 'postcss-loader',
    'less-loader',
  ].join('!');
} else {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }));

  var cssBundleName = path.join('css', util.format('[name].%s.css', pkg.version));
  plugins.push(new ExtractTextPlugin(cssBundleName));

  cssLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader?localIdentName=[hash:base64:5]',
    // 'postcss-loader',
    'less-loader',
  ].join('!'));
}
jsLoaders.push('babel');
module.exports = {
  entry: {app: './TextInput.js'},
  context: path.join(__dirname, './src'),
  output: {
    path: path.resolve('./build'),
    filename: path.join('js', util.format('[name].%s.js', pkg.version)),
    publicPath: '/'
  },
  plugins: plugins,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|env)/,
        loaders: jsLoaders,
      },
      {
        test: /env/,
        loader: 'file-loader?name=[path][name].[ext]',
      },
      {
        test: /\.png/,
        loader: isDevMode ? 'url-loader?name=assets/[name].[ext]&limit=100000' : 'file-loader?name=[path][name].[ext]',
      },
      {
        test: /\.less$/,
        loader: cssLoader,
      },
      {
        test: /\.css$/,
        loader: cssLoader,
      },
      {
        test: /\.html$/,
        loader: htmlLoader,
      },
      {
        test: /\.eot(\?\S*)?/,
        loader: 'url-loader?name=assets/[name].[ext]&limit=100000&mimetype=application/vnd.ms-fontobject'
      },
      {
        test: /\.woff2(\?\S*)?/,
        loader: 'url-loader?name=assets/[name].[ext]&imit=100000&mimetype=application/font-woff2'
      },
      {
        test: /\.woff(\?\S*)?/,
        loader: 'url-loader?name=assets/[name].[ext]&limit=100000&mimetype=application/font-woff'
      },
      {test: /\.ttf(\?\S*)?/, loader: 'url-loader?name=assets/[name].[ext]&limit=100000&mimetype=application/font-ttf'},
      {test: /\.svg(\?\S*)?/, loader: 'url-loader?name=assets/[name].[ext]&limit=100000&mimetype=application/font-svg'},
    ]
  },
  devtool: isDevMode ? 'source-map' : false,
  devServer: {
    contentBase: path.resolve('./build'),
    headers: {"Access-Control-Allow-Origin": "*"},
    hot: true,
    noInfo: false,
    inline: true,
    stats: {colors: true}
  }
};
