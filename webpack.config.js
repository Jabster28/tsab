const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/client.ts",
  resolve: {
    extensions: [".ts", ".js", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "client.js",
    path: path.join(__dirname, "dist"),
  },
  devtool: "sourcemap",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "public/",
          to: "./",
        },
      ],
    }),
  ],
};
