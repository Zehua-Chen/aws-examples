const gulp = require('gulp');
const webpack = require('webpack-stream');
const path = require('path');

function buildFunction(entry, output) {
  return () => {
    return gulp
      .src(entry, {})
      .pipe(
        webpack({
          target: 'node',
          mode: 'production',
          output: {
            filename: 'index.cjs',
            library: {
              type: 'commonjs-static',
            },
          },
          devtool: 'source-map',
          resolve: {
            alias: {
              carts: path.join(__dirname, 'carts'),
            },
            extensions: ['.ts', '.js'],
          },
          module: {
            rules: [
              {
                test: /\.ts$/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-typescript'],
                  },
                },
              },
            ],
          },
          externals: ['@aws-sdk/client-dynamodb'],
        })
      )
      .pipe(gulp.dest(output));
  };
}

module.exports.build = gulp.parallel([
  buildFunction(
    path.join('carts', 'functions', 'buy', 'index.ts'),
    path.join('out', 'carts', 'buy')
  ),
  buildFunction(
    path.join('carts', 'functions', 'populate', 'index.ts'),
    path.join('out', 'carts', 'populate')
  ),
]);
