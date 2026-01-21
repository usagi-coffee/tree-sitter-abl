# tree-sitter-abl

OpenEdge Advanced Business Language (ABL) grammar for tree-sitter.

To see the syntax tree outputs see `test/corpus`.

## Usage

### Node

```bash
npm install @usagi-coffee/tree-sitter-abl
```

### WASM

Prebuilt WASM binary can be found in the NPM package or build yourself with `tree-sitter build -w`.

```
// Getting wasm binary from the npm package
const fs = require('node:fs');
const mod = fs.readFileSync('node_modules/@usagi-coffee/tree-sitter-abl/tree-sitter-abl.wasm');
```

### Shared library (.so)

Prebuilt shared library can be found in NPM package or in releases on github or build yourself with `tree-sitter build`.

## License

```LICENSE
MIT License

Copyright (c) Kamil Jakubus, Jason Chrosrova, Eglė Kazbaraitė and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
