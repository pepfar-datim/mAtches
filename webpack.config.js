const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html", 
  filename: "./index.html"
});
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].js",
    publicPath: '/'
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname + '/src')
    }
  },
  plugins: [
    htmlPlugin    
    ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "eslint-loader"
          }
        ]
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
