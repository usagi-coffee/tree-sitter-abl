# tree-sitter-abl

OpenEdge Advanced Business Language (ABL) grammar for tree-sitter.

## Usage

For the grammar usage in your project look at tree-sitter documentation on how to use the grammar parsers because you can use tree-sitter parsers using [node](https://github.com/tree-sitter/node-tree-sitter)/[rust](https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_rust)/[wasm](https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web) bindings.

### Node

```bash
npm install @usagi-coffee/tree-sitter-abl
```

### WASM

Prebuilt WASM binary can be found in NPM package or build yourself with `npx tree-sitter build-wasm`.
Follow [web-tree-sitter](https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web) binding documentation.

```
// Getting wasm binary from the npm package
const fs = require('node:fs');
const mod = fs.readFileSync('node_modules/@usagi-coffee/tree-sitter-abl/tree-sitter-abl.wasm');
```

### Running the tests

```bash
npm run test
```

### Testing your file

```bash
npm run parse your_file.p
```

## Supported grammar

- [X] Comments
- [X] Variables
- [X] Unary/Binary operators
- [X] Comparisons
- [X] Conditional statements
- [X] Loops
- [X] Functions
- [X] Procedures
- [X] Ternary expression
- [X] Object accessors
- [X] Case/Switch statement
- [X] Transactions
- [X] Buffers
- [X] Streams
- [X] Includes
- [X] Aggregate phrases
- [ ] ...

### ABL Query
- [X] FOR (EACH/FIRST/LAST) statement
- [X] FIND statement
- [ ] ...

### ABL Statements / Expressions

> Even though many statemenents are not listed it doesn't ***necessarily*** mean they're not parsable, it just means the syntax tree won't have details about the statement!

- [X] ASSIGN
- [X] ACCUMULATE
- [X] AVAILABLE (expression)
- [ ] ...
  
Keep in mind these were tested on trivial examples so it may be broken in your case, if that happens please file an issue!

There is much more grammar that needs to be listed, implemented and added to the tests. Feel free to open issue/send pull request for the grammar that you need!

Check out `test/corpus` directory to see the syntax tree output for specific grammar and examples.

## License

```LICENSE
MIT License

Copyright (c) Kamil Jakubus, Jason Chrosrova and contributors

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
