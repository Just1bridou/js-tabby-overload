var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist/sandbox/'),
    publicPath: '/dist/sandbox/',
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {}
          }
        ],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!(striptags)\/).*/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    // Replace the lazy-cache-based utils with a webpack-compatible eager-require shim.
    // lazy-cache rewrites the global `require` at module-load time, which breaks
    // webpack's static analysis and causes a "Cannot find module '.'" runtime error.
    new webpack.NormalModuleReplacementPlugin(
      /handlebars-helpers[\/\\]lib[\/\\]utils[\/\\]utils\.js$/,
      path.resolve(__dirname, 'src/handlebars-helpers-utils-shim.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /create-frame[\/\\]utils\.js$/,
      path.resolve(__dirname, 'src/create-frame-utils-shim.js')
    )
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  node: {
    fs: 'empty',
    path: true,
    child_process: 'empty',
    module: 'empty',
    readline: 'empty'
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'none';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
