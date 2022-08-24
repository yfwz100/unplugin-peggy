# unplugin-peggy

The unified plugin of [Peggy][] (a fork of [PEG.js][]) for webpack/rollup/vite/... It is originally forked from [rollup-plugin-peggy][] & [rollup-plugin-pegjs][], which are seemed not actively maintained.

## Installation

```sh
npm i -D unplugin-peggy
```

## Usage

Take rollup as an example:

```js
import { defineConfig } from 'rollup';
import peggy from 'unplugin-peggy';

export default defineConfig({
  plugins: [peggy.rollup()],
});
```

The detail of the options can be found in the TypeScript declaration file.

## License

MIT

[peggy]: https://peggyjs.org 'Peggy: Parser Generator for JavaScript'
[peg.js]: https://github.com/pegjs/pegjs 'PEG.js: Parser Generator for JavaScript'
[rollup-plugin-peggy]: https://github.com/caleb531/rollup-plugin-peggy 'rollup-plugin-peggy'
[rollup-plugin-pegjs]: https://github.com/cameronhunter/rollup-plugin-pegjs 'rollup-plugin-pegjs'
