var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');


var configPath = process.argv[2] || './webpack.config.js';
var config = require(configPath);

var server = new WebpackDevServer(
  webpack(config),
  config.devServer
);
server.listen(8080, '0.0.0.0', function (err) {
  console.log('Ok');
});
