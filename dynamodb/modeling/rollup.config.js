const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const path = require('path');

/**
 *
 * @param {string} folder
 * @returns
 */
function bundleLambda(folder) {
  return {
    input: path.join(folder, 'index.ts'),
    external: ['@aws-sdk/client-dynamodb'],
    output: {
      file: path.join('out', folder, 'index.js'),
      format: 'cjs',
    },
    plugins: [
      babel({
        extensions: ['.ts'],
        presets: ['@babel/preset-typescript'],
        plugins: [],
        configFile: false,
        babelHelpers: 'bundled',
      }),
      nodeResolve({ extensions: ['.ts'] }),
      terser(),
    ],
  };
}

module.exports = [
  bundleLambda(path.join('carts', 'populate')),
  bundleLambda(path.join('carts', 'buy')),
];
