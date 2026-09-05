# tree-sitter-abl

OpenEdge Advanced Business Language (ABL) grammar for tree-sitter.

## Notes

The grammar currently faces a few issues, please keep in mind:

- Tree-sitter generated `parser.c` (due to high action/state count) is currently beyond the GitHub file limit (100MiB) so it needs to be "minified" to be hosted on GitHub, look at `tools/minify.js`.
- During the `.wasm` build, tree-sitter uses [`wasm-opt`](https://github.com/WebAssembly/binaryen) optimization pass on the binary, the pass [takes a long time](https://github.com/WebAssembly/binaryen/issues/7319) (~16mins), please be patient.

## See also

- [tree-sitter-df](https://github.com/usagi-coffee/tree-sitter-df)
- [zed-openedge-abl](https://github.com/usagi-coffee/zed-openedge-abl)
- [vscode-openedge-abl](https://github.com/usagi-coffee/vscode-openedge-abl)
- [abl-language-server](https://github.com/usagi-coffee/abl-language-server)

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
