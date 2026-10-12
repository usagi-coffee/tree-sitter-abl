// kw("DISPLAY") -> token(/DISPLAY/i)
// kw("DISPLAY", { offset: 3 }) -> token(/DISP(L(A(Y)?)?)?/i)  // DISP, DISPL, DISPLA, DISPLAY
// Note: Partial keywords are aliased to the original word
// Lexical precedence is independent of the named parse-precedence groups.
// Preferred keywords must beat broad value/identifier tokens in the same lexer state.
const lexicalPrecedences = { keyword: 1 };

export function kw(word, options) {
  const { alias: aliasName = word, offset, precedence } = options || {};
  if (precedence !== undefined && !Object.hasOwn(lexicalPrecedences, precedence)) {
    throw new Error(`Unknown keyword lexical precedence: ${precedence}`);
  }
  // alias: false keeps the token available for an enclosing named alias.
  const keywordRule = (pattern) =>
    aliasName === false ? keywordToken(pattern) : alias(keywordToken(pattern), aliasName);
  const keywordToken = (pattern) =>
    token(precedence === undefined ? pattern : prec(lexicalPrecedences[precedence], pattern));
  const off = Number.isInteger(offset) ? offset - 1 : -1; // default: require full word

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const s = esc(word);

  const buildProgressiveOptional = (rest) => {
    let out = "";
    for (let i = rest.length - 1; i >= 0; i--) {
      out = rest[i] + (out ? `(${out})?` : "");
    }
    return out ? `(${out})?` : "";
  };

  if (off < 0) {
    return keywordRule(new RegExp(s, "i"));
  }

  const min = Math.min(Math.max(off + 1, 0), s.length); // require up to offset (inclusive)
  const required = s.slice(0, min);
  const rest = s.slice(min);

  const pattern = required + buildProgressiveOptional(rest);
  return keywordRule(new RegExp(pattern, "i"));
}

// Utility to grab every keyword from the grammar source code
import fs from "node:fs";
import path from "node:path";

export function collect_keyword_words(rootDir, excludedWords = []) {
  const files = [];
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".js")) {
        files.push(fullPath);
      }
    }
  }

  const keywords = new Set();
  const regex = /kw\(\s*["']([^"']+)["']\s*(?:,|\))/g;
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    let match;
    while ((match = regex.exec(content))) {
      keywords.add(match[1]);
    }
  }

  const excluded = new Set(excludedWords.map((word) => word.toUpperCase()));
  return Array.from(keywords).filter((word) => !excluded.has(word.toUpperCase()));
}
