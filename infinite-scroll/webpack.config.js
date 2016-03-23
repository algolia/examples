var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: '#source-map',
  entry: {
    app: ['./src/js/app.js']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/app.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body'
    }),
    new ExtractTextPlugin('css/[name].css')
  ],
  module: {
    loaders:[
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test:  /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },
  watch: true
}
