# tree-sitter-abl

OpenEdge Advanced Business Language (ABL) grammar for tree-sitter.

> [!WARNING]
> While the parser already implements most ABL statements (at least those defined in the reference), the shape of AST nodes is not yet considered stable. The grammar should be treated as **experimental**, and breaking changes are expected.

## Integrating

Currently the grammar faces a few problems that might arise when integrating, keep in mind: 

1. Tree-sitter generated output `parser.c` out-of-box using `tree-sitter generate` is currently beyond the github file limit (100MiB) so it needs to be "minified" to be able to be hosted on github, look at `tools/minify.js`.
2. Compiling WASM is almost impossible without upstream fixes in LLVM, [the fix has been merged](https://github.com/llvm/llvm-project/pull/181755), this change is expected to come out in `clang-23`, it later needs to be adopted in [wasi-sdk](https://github.com/WebAssembly/wasi-sdk) (and optionally [emscripten](https://emscripten.org/)) in order for `tree-sitter build --wasm` to actually compile the webassembly binary.
3. Tree-sitter uses an optimization pass AFTER compililng the webassembly, it uses `wasm-opt` from [binaryen](https://github.com/WebAssembly/binaryen), the optimizer has [an issue](https://github.com/WebAssembly/binaryen/issues/7319) with such a big wasm binaries, so the pass takes about 16 minutes on my machine to succeed, be patient.

## See also

- [abl-language-server](https://github.com/usagi-coffee/abl-language-server)
- [tree-sitter-df](https://github.com/usagi-coffee/tree-sitter-df)
- [zed-openedge-abl](https://github.com/usagi-coffee/zed-openedge-abl)

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
