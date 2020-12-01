const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const baseDirectory = __dirname; //js

module.exports = merge(common, {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
  mode: "development",
  devtool: "inline-source-map",
  context: baseDirectory,
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map",
  watch: true,
});
