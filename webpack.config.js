const path = require('path');

const HtmlWebPackPlugin = require("html-webpack-plugin");
const WebpackBar = require('webpackbar');  // Để vễ process ba
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Tự động xóa các file build sau khi npm startr
const Dotenv = require('dotenv-webpack');
const AutoDllPlugin = require('autodll-webpack-plugin'); // Giup cho run vs rebuild nhanh hơn

module.exports = {
  entry: './src/index.js', // File sẽ được biên dịch

  // Nơi file đươc build ra
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].bundle.js'
  },

  resolve: {
    // Setting alias resolve, nhớ setting thêm trong jsonconfig.json để visual code biết
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets/')
    }
  },

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
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{
          loader: 'file-loader'
        }]
      }
    ]
  },

  // Setting PORT LINK HEADER ...
  devServer: {
    port: process.env.PORT || 3000, // Set port cho server
    noInfo: true, // Không cho hiên message webpack khi run
    hot: true // Khi t thay đổi file code thì không phải load lại hoàn toàn
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
    }),
    new WebpackBar(),
    new CleanWebpackPlugin(),
    new Dotenv({
      path: './.env', // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false // load '.env.defaults' as the default values if empty.
    }),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundles to index.html
      filename: '[name].dll.js',
      publicPath: '',
      entry: {
        vendor: ['react', 'react-dom']
      }
    }),
  ]
};