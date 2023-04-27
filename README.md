# tree-sitter-abl

> The project is in very early stage - expect that it's very broken and incomplete, contributions welcome!

OpenEdge Advanced Business Language (ABL) grammar for tree-sitter.

## Usage

For the grammar usage in your project look at tree-sitter documentation on how to use the grammar parsers.

### Running the tests

```bash
npm run test
```

### Testing your file

```bash
npm run parse your_file.p
```

## Supported grammar

> Current goal of the parser assumes non-frame ABL syntax so things like DISPLAY, DEFINE BUTTON or similar statements that are meant for the progress environment are probably not going to be supported/fully supported.

- [X] Comments
- [X] Variable definitions
- [X] Variable assignments
- [X] Comparisons
- [X] Conditional statements
- [X] Loops
- [X] Functions
- [X] Function calls
- [X] Procedures
- [ ] Ternary operator (IF THEN ELSE)
- [ ] Object accessors/methods
- [ ] Buffers
- [ ] ...

### ABL Query
- [X] FOR (EACH/FIRST/LAST) statement
- [ ] FIND statement
- [ ] ...

### ABL Statements
- [X] ASSIGN
- [ ] PUT
- [ ] ...
  
Keep in mind these were tested on trivial examples so it may be broken in your case, if that happens please file an issue!

There is much more grammar that needs to be listed, implemented and added to the tests. Feel free to open issue/send pull request for the grammar that you need!

Check out `test/corpus` directory to see the syntax tree output for specific grammar and examples.

## License

```LICENSE
MIT License

Copyright (c) 2023 Kamil Jakubus and contributors

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