import * as path from 'path';

export default {
  target: 'node',
  mode: 'production',
  entry: path.resolve('index.ts'),
  output: {
    filename: 'index.cjs',
    path: path.join(path.dirname(new URL(import.meta.url).pathname), 'out'),
    library: {
      type: 'commonjs-static',
    },
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts'],
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
};
