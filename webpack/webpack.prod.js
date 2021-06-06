const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  plugins: [
    new webpack.DefinePlugin({
      // 'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', globOptions: { igore: ['*.html'] } }]
    })
  ]
}
