const path = require("path");
const webpack = require("webpack");
const dotenv = require('dotenv');
dotenv.config();
module.exports = function (entry, argv) {
  let BACKEND_URL = "";
  if(argv.mode === 'development'){
    BACKEND_URL = process.env.REACT_BACKEND_DEV_URL;
  }
  if(argv.mode === 'production'){
    BACKEND_URL = process.env.REACT_BACKEND_PROD_URL;

  }
  
  return {
    mode: "none",
    entry: path.resolve(`src/index.js`),
    output: {
      path: path.resolve("../backend/src/main/resources"),
      filename: "assets/js/main.js",
      assetModuleFilename: "assets/images/[hash][ext]",
    },
    module: {
      rules: [
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            configFile: path.resolve("config/babel.config.json"),
          },
        },
        {
          test: /\.(sa|sc|c)ss$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: false,
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.(png|gif|jpe?g|svg|ico|tiff?|bmp)$/i,
          type: "asset/resource",
        },
      ],
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    devtool: "eval-source-map",
    devServer: {
      host: "0.0.0.0",
      port: 3000,
      proxy: {
        "/api": BACKEND_URL+":8080",
        "/ws-stomp": { target: BACKEND_URL+":8080/ws", ws: true },
      },
      liveReload: true,
      hot: true,
      compress: true,
      historyApiFallback: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env" : JSON.stringify(BACKEND_URL)
      })
    ]
  };
};