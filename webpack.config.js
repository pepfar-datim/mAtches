const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

const config = require('./config.json');

const indexPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html", 
  filename: "./index.html"
});
const errorPlugin = new HtmlWebPackPlugin({
  template: "./src/error.html",
  filename: "./error.html"
});
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, 'dist' + config.base.slice(0,-1)),
    filename: "[name].js",
    publicPath: config.base,
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname + '/src')
    }
  },
  plugins: [
    indexPlugin,
    errorPlugin,
    ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: "file-loader"
        }
      }
    ]
  }
};
