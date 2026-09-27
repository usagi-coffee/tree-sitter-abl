import { RESERVED_KEYWORDS, UNRESERVED_KEYWORDS } from "./keyword-data.js";

function spellings(data) {
  return data
    .trim()
    .split(/\s+/)
    .flatMap((entry) => {
      const [word, minimum] = entry.split(":");
      const start = minimum ? Number(minimum) : word.length;
      return Array.from({ length: word.length - start + 1 }, (_, index) =>
        word.slice(0, start + index),
      );
    });
}

const blockKeywords = new Set([...spellings(RESERVED_KEYWORDS), "FINALLY"]);
const editingKeywords = new Set([...blockKeywords, ...spellings(UNRESERVED_KEYWORDS)]);

export function label_identifier(editing = false) {
  return token(identifier_except(editing ? editingKeywords : blockKeywords));
}

// Tree-sitter regexes do not support negative lookahead. A trie expresses the
// complement of the excluded words while retaining the identifier alphabet.
function identifier_except(words) {
  const root = { children: new Map(), end: false };
  for (const word of words) {
    let node = root;
    for (const char of word.toUpperCase()) {
      if (!node.children.has(char)) node.children.set(char, { children: new Map(), end: false });
      node = node.children.get(char);
    }
    node.end = true;
  }
  const first = String.raw`_\p{L}`;
  const rest = String.raw`\p{L}\p{N}_\-&#%$!`;
  const escape = (char) => (char === "-" ? "\\-" : char);
  const cases = (char) => escape(char.toUpperCase()) + escape(char.toLowerCase());
  const pattern = (node, initial = false) => {
    const children = [...node.children.keys()].sort();
    const alphabet = initial ? first : rest;
    const branches = [
      children.length
        ? `[[${alphabet}]--[${children.map(cases).join("")}]]` + `[${rest}]*`
        : `[${alphabet}][${rest}]*`,
    ];
    for (const char of children)
      branches.push(`[${cases(char)}]${pattern(node.children.get(char))}`);
    if (!initial && !node.end) branches.push("");
    return `(?:${branches.join("|")})`;
  };
  return new RustRegex(pattern(root, true));
}
