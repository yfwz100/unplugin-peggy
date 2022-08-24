import { resolve } from 'path';
import { defineConfig } from 'rollup';
import ts from 'rollup-plugin-ts';

const projectRoot = (...args: string[]) => resolve(__dirname, ...args);

export default defineConfig({
  input: projectRoot('src', 'plugin.ts'),
  output: [
    {
      file: projectRoot('dist', 'plugin.js'),
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: projectRoot('dist', 'plugin.mjs'),
      format: 'esm',
    },
  ],
  external: ['peggy', 'unplugin'],
  plugins: [ts()],
});
