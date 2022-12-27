import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'index.ts',
    output: {
      dir: 'out',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      babel({
        extensions: ['.ts'],
        presets: ['@babel/preset-typescript'],
        sourceMaps: true,
        plugins: [],
        configFile: false,
        babelHelpers: 'bundled',
      }),
      nodeResolve({ extensions: ['.ts'] }),
    ],
  },
];
