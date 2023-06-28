const path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    entry: "./src/popupIndex.js",
    mode: "production",
    module: {
      rules: [
        {
          test: /\.(?:js|jsx|mjs|cjs)$/,
          exclude: /(?:node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: "defaults" }]
              ]
            }
          }
        },
        {
          test: /\.css$/i,
          exclude: /node_modules/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/popup.html',
        filename: '../popup/popup.html',
        inject: false
    })
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "popup.js",
      path: path.resolve(__dirname, "..", "extension/popup"),
      publicPath: ''
    }
  },
  {
    entry: "./src/contentScriptIndex.js",
    mode: "production",
    module: {
      rules: [
        {
          test: /\.(?:js|jsx|mjs|cjs)$/,
          exclude: [
            /(?:node_modules)/,
            /src\/components\/contentAssist.js/
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: "defaults" }]
              ]
            }
          }
        },
        {
          test: /\.css$/i,
          exclude: /node_modules/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.png/,
          type: 'asset/resource',
          generator: {
            filename: '../cursors/[name][ext]'
          }
        }
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "content.js",
      path: path.resolve(__dirname, "..", "extension/contentScript"),
      publicPath: ''
    }
  }
];