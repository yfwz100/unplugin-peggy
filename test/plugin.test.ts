import path from 'path';
import util from 'util';

import { describe, it, expect } from 'vitest';
import { rollup } from 'rollup';
import { webpack } from 'webpack';
import MemoryFS from 'memory-fs';

import peggy from '../src/plugin';

describe('plugin', () => {
  it('should be used in rollup', async () => {
    const bundle = await rollup({
      input: path.join(__dirname, 'grammar.pegjs'),
      plugins: [peggy.rollup()],
    });
    const generatedCode = (await bundle.generate({ format: 'iife' }))
      .output?.[0].code;
    const { parse } = new Function(`return ${generatedCode}`).call(undefined);

    expect(parse('PASS?')).toEqual({ pass: true });
    expect(parse('FAIL!')).toEqual({ pass: false });
  });

  it('should be used in webpack', async () => {
    const compiler = webpack({
      mode: 'development',
      entry: path.resolve(__dirname, 'grammar.pegjs'),
      output: {
        filename: 'grammar.js',
        path: '/',
        library: 'grammar',
        libraryTarget: 'assign',
      },
      plugins: [peggy.webpack()],
      devtool: false,
    });
    const fs = new MemoryFS();
    compiler.outputFileSystem = fs;
    const stat = await util.promisify(compiler.run).call(compiler);
    if (!stat || stat.hasErrors()) {
      throw new Error(stat?.toString() ?? 'stat is undefined');
    }
    const generatedCode = fs.readFileSync('/grammar.js').toString();
    const { parse } = new Function(
      'grammar',
      `${generatedCode}; return grammar;`
    ).call(undefined);

    expect(parse('PASS?')).toEqual({ pass: true });
    expect(parse('FAIL!')).toEqual({ pass: false });
  });
});
