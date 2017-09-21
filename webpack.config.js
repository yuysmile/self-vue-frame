const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const url = require('url')
const publicPath = ''

module.exports = (options = {}) => ({
  entry: {
    index: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: options.dev ? '/' : publicPath
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ].concat(prod()),
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  },
  devServer: {
    open:true
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
});
function prod(){
  if (process.env.NODE_ENV === 'production') {
    return [
      new CopyWebpackPlugin([
        { from: __dirname + '/src/config/config_prod.json', to: './config.json' }
      ])
    ]
  } else {
    return [
      new CopyWebpackPlugin([
        { from: __dirname + '/src/config/config_dev.json', to: './config.json' }
      ])
    ]
  }
}
