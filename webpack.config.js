const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '',
  },
  mode: 'development',
  devServer: {
    static: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    port: 8080
  },
  module: {
    rules: [
        {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: ['svg-inline-loader'],
        },
        {
            test: /\.css$/, use: [ 'style-loader', 'css-loader' ]
        },
        {
            test: /\.(png|jpg|gif|woff(2)?|eot|ttf|otf)$/,
            type: 'asset/resource',
        },
        
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),

  ]
}