const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;   分析打包文件

module.exports = {
  devtool: "eval-source-map",
  entry: { bundle: ['@babel/polyfill', 'react-hot-loader/patch', __dirname + "/src/index.js"] },
  output: {
    path: __dirname + "/public",
    filename: "[name]-[hash:5].js"
  },
  devServer: {
    contentBase: "./public",
    publicPath: "/",
    historyApiFallback: true,
    inline: true,
    hot: true,
    proxy: {
      "/search/*": {
        target: "https://image.baidu.com",
        changeOrigin: true
      }
    }
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: /node_modules/
      },
      {
        test: /(\.css|\.less)$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true, // 指定启用css modules
              localIdentName: "[name]__[local]--[hash:base64:5]" // 指定css的类名格式
            }
          },
          {
            loader: "less-loader"
          }
        ],
        exclude: /node_modules/ //那些文件需要用上述loader
      },
      {
        test: /(\.css|\.less)$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ],
        exclude: /src/ //那些文件需要用上述loader
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              outputPath: 'img'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      editTable: __dirname + "/src/editTable",
      timeline: __dirname + "/src/timeline",
      main: __dirname + "/src/main",
      waterfall: __dirname + "/src/waterfall",
      canvas: __dirname + "/src/canvas",
      test: __dirname + "/src/test",
      utils: __dirname + "/src/utils",
      demo: __dirname + "/src/demo"
    }
  },
  plugins: [
    new webpack.BannerPlugin("版权所有，翻版必究"),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin("style.css"),
    new CleanWebpackPlugin({
      root: __dirname + "/public",
      cleanStaleWebpackAssets: false,
      // exclude: ['assets'],
      verbose: true // Write logs to console.
    }),

    new HtmlWebpackPlugin({
      filename: __dirname + "/public/index.html",
      template: path.join(__dirname, 'src/index.html'),
      title: 'my-react-example',
      inject: true
    }),
    // new BundleAnalyzerPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()

  ]
};
// __dirname+'/js/newFeatureofEs6.js',__dirname+'/js/iteratorDemo.js',__dirname+'/js/test.js'
