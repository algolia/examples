var path = require('path')
  , HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: ["./src/js/app.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "js/app.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body'
    })
  ],
  watch: true
}
