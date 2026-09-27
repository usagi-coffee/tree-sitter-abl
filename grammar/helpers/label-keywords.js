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

const blockKeywords = new Set([...spellings(RESERVED_KEYWORDS), "FINALLY", "*", "/", "@"]);
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
  const first = String.raw`_\p{L}&#%$!@*/`;
  const rest = String.raw`\p{L}\p{N}_\-+&#%$!@*/`;
  // A period followed by a digit stays in the name; a.b is qualified syntax.
  const tail = String.raw`(?:[${rest}]|\.[0-9])*`;
  const escape = (char) => (char === "-" ? "\\-" : char);
  const cases = (char) => escape(char.toUpperCase()) + escape(char.toLowerCase());
  const pattern = (node, initial = false) => {
    const children = [...node.children.keys()].sort();
    const alphabet = initial ? first : rest;
    const branches = [
      children.length
        ? `[[${alphabet}]--[${children.map(cases).join("")}]]${tail}`
        : `[${alphabet}]${tail}`,
    ];
    if (!initial) branches.push(String.raw`\.[0-9]${tail}`);
    for (const char of children)
      branches.push(`[${cases(char)}]${pattern(node.children.get(char))}`);
    if (!initial && !node.end) branches.push("");
    return `(?:${branches.join("|")})`;
  };
  // Numeric and operator prefixes need a nonnumeric name character. Hexadecimal
  // literals (0xFF and -0xFF) remain numbers; +0xFF is an identifier in ABL.
  const prefixUnit = String.raw`(?:[+\-/0-9]|\.[0-9])`;
  const prefix = String.raw`(?:[+\-0-9]|\.[0-9])${prefixUnit}*`;
  const core = String.raw`\p{L}_&#%$!@*`;
  const nonHexPrefix = String.raw`(?:[+1-9]|\.[0-9]|0${prefixUnit}|-(?:[+\-/1-9]|\.[0-9])|-0${prefixUnit})${prefixUnit}*|-`;
  const extended = String.raw`${prefix}[[${core}]--[xX]]${tail}|(?:${nonHexPrefix})[xX]${tail}|-?0[xX][0-9a-fA-F]*(?:[[${rest}]--[0-9a-fA-F]]|\.[0-9])${tail}`;
  return new RustRegex(`${pattern(root, true)}|${extended}`);
}
