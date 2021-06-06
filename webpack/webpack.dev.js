const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

// const ASSET_PATH = process.env.ASSET_PATH || '/public'

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    open: true
  },
  // output: {
  //   publicPath: ASSET_PATH
  // },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      // 'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    })
  ]
}
