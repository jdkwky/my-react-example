const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  devtool: 'eval-source-map',
  entry: { bundle: __dirname + '/src/index.js' },
  output: {
    path: __dirname + '/public',
    filename: '[name].js'
  },
  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    inline: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'es2015', 'stage-0'],
            plugins: [['import', { libraryName: 'antd', style: 'css' }], 'transform-class-properties']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /(\.css|\.less)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true, // 指定启用css modules
              localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
            }
          },
          {
            loader: 'less-loader'
          },
          {
            loader: 'postcss-loader'
          }
        ],
        exclude: /node_modules/ //那些文件需要用上述loader
      },
      {
        test: /(\.css|\.less)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ],
        exclude: /src/ //那些文件需要用上述loader
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      editTable: __dirname + '/src/editTable',
      timeline: __dirname + '/src/timeline'
    }
  },
  plugins: [
    new webpack.BannerPlugin('版权所有，翻版必究'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('style.css')
  ]
};
// __dirname+'/js/newFeatureofEs6.js',__dirname+'/js/iteratorDemo.js',__dirname+'/js/test.js'
