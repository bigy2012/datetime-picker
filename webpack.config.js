const path = require('path');

module.exports = {
  entry: './src/datetime-picker.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      // Add other loaders as needed
    ],
  },
  mode: 'development', // or 'production'
};
