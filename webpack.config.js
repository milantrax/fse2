const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const fs = require('fs');

// Get all block directories
const blockDirs = glob.sync('./blocks/*/');

// Create entry points for all blocks
const blockEntries = {};
blockDirs.forEach(dir => {
  const blockName = path.basename(dir);
  const srcIndex = `./${path.join(dir, 'src/index.js')}`;
  if (fs.existsSync(srcIndex)) {
    blockEntries[`blocks/${blockName}/build/index`] = srcIndex;
  }
});

module.exports = {
  entry: {
    'assets/build/main': [
        './assets/src/js/main.js',
        './assets/src/scss/main.scss'
    ],
    ...blockEntries
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@wordpress/babel-preset-default']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              api: 'modern'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
  ],
  externals: {
    '@wordpress/blocks': ['wp', 'blocks'],
    '@wordpress/block-editor': ['wp', 'blockEditor'],
    '@wordpress/components': ['wp', 'components'],
    '@wordpress/element': ['wp', 'element'],
    '@wordpress/i18n': ['wp', 'i18n'],
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
