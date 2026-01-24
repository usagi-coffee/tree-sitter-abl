# tree-sitter-abl

OpenEdge Advanced Business Language (ABL) grammar for tree-sitter.

While the parser already implements most ABL statements (at least those defined in the reference), the shape of AST nodes is not yet considered stable. The grammar should be treated as **experimental**, and breaking changes are expected.

---

## Design

- Core rules are intentionally lean and mostly located in a single file (`grammar.js`), with aggregate rules split out to avoid blowing up AI context.
- Grammar rules are explicit and localized, making them easier for AI models to reason about.
- Intentional duplication at the statement level resolves many ambiguities and helps avoid conflicts and precedence-based hacks.
- Enforces an “if it does not parse, it is not supported” rule, avoiding ambiguous or overly permissive grammar patterns by design*.

\* Some rules are currently omitted due to Tree-sitter’s `STATE_COUNT` limitations as certain ABL constructs impose strict ordering requirements that cause state explosion beyond tree-sitter's hard limit.
## Usage

### Node

```bash
npm install @usagi-coffee/tree-sitter-abl
```

### WASM

Prebuilt WASM binary can be found in the NPM package or in releases, to build yourself run `tree-sitter build -w`.

```
// Getting wasm binary from the npm package
const fs = require('node:fs');
const mod = fs.readFileSync('node_modules/@usagi-coffee/tree-sitter-abl/tree-sitter-abl.wasm');
```

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
