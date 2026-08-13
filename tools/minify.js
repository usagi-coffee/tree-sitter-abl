import { resolve } from "node:path";

const inputPath = resolve(process.argv[2] ?? "src/parser.c");

const PUNCTUATORS = [
  "<<=",
  ">>=",
  "...",
  "->",
  "++",
  "--",
  "<<",
  ">>",
  "<=",
  ">=",
  "==",
  "!=",
  "&&",
  "||",
  "*=",
  "/=",
  "%=",
  "+=",
  "-=",
  "&=",
  "^=",
  "|=",
  "##",
  "<:",
  ":>",
  "<%",
  "%>",
  "%:",
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  ".",
  "&",
  "*",
  "+",
  "-",
  "~",
  "!",
  "/",
  "%",
  "<",
  ">",
  "^",
  "|",
  "?",
  ":",
  ";",
  "=",
  ",",
];

const WORDLIKE_TYPES = new Set(["identifier", "number", "string", "char"]);

function isWhitespace(char) {
  return /\s/.test(char);
}

function isIdentifierStart(char) {
  return /[A-Za-z_]/.test(char);
}

function isIdentifierContinue(char) {
  return /[A-Za-z0-9_]/.test(char);
}

function isDigit(char) {
  return /[0-9]/.test(char);
}

function isHexDigit(char) {
  return /[0-9A-Fa-f]/.test(char);
}

function readQuoted(text, start, quote) {
  let index = start + 1;
  while (index < text.length) {
    if (text[index] === "\\") {
      index += 2;
      continue;
    }
    if (text[index] === quote) {
      return { value: text.slice(start, index + 1), end: index + 1 };
    }
    index += 1;
  }
  return { value: text.slice(start), end: text.length };
}

function readIdentifier(text, start) {
  let index = start + 1;
  while (index < text.length && isIdentifierContinue(text[index])) index += 1;
  return { type: "identifier", value: text.slice(start, index), end: index };
}

function readNumber(text, start) {
  let index = start;

  if (text[index] === "0" && (text[index + 1] === "x" || text[index + 1] === "X")) {
    index += 2;
    while (index < text.length && isHexDigit(text[index])) index += 1;
    while (index < text.length && /[uUlL]/.test(text[index])) index += 1;
    return { type: "number", value: text.slice(start, index), end: index };
  }

  while (index < text.length && isDigit(text[index])) index += 1;

  if (text[index] === "." && isDigit(text[index + 1])) {
    index += 1;
    while (index < text.length && isDigit(text[index])) index += 1;
  }

  if (text[index] === "e" || text[index] === "E") {
    let expIndex = index + 1;
    if (text[expIndex] === "+" || text[expIndex] === "-") expIndex += 1;
    if (isDigit(text[expIndex])) {
      index = expIndex + 1;
      while (index < text.length && isDigit(text[index])) index += 1;
    }
  }

  while (index < text.length && /[uUlLfF]/.test(text[index])) index += 1;

  return { type: "number", value: text.slice(start, index), end: index };
}

function readPunctuator(text, start) {
  for (const punctuator of PUNCTUATORS) {
    if (text.startsWith(punctuator, start)) {
      return { type: "punct", value: punctuator, end: start + punctuator.length };
    }
  }
  return { type: "punct", value: text[start], end: start + 1 };
}

function needsSpace(previous, next) {
  if (!previous) return false;

  if (WORDLIKE_TYPES.has(previous.type) && WORDLIKE_TYPES.has(next.type)) {
    return true;
  }

  if (previous.type === "number" && next.type === "punct" && next.value === ".") {
    return true;
  }

  if (previous.type === "punct" && previous.value === "." && next.type === "number") {
    return true;
  }

  if (previous.type === "punct" && next.type === "punct") {
    return (
      PUNCTUATORS.includes(previous.value + next.value) ||
      previous.value === "/" ||
      next.value === "/"
    );
  }

  return false;
}

function minifyCodeChunk(text) {
  let index = 0;
  let output = "";
  let previous = null;

  while (index < text.length) {
    const char = text[index];

    if (isWhitespace(char)) {
      index += 1;
      continue;
    }

    if (char === "/" && text[index + 1] === "/") {
      index += 2;
      while (index < text.length && text[index] !== "\n") index += 1;
      continue;
    }

    if (char === "/" && text[index + 1] === "*") {
      index += 2;
      while (index + 1 < text.length && !(text[index] === "*" && text[index + 1] === "/"))
        index += 1;
      index = Math.min(index + 2, text.length);
      continue;
    }

    let token;

    if (char === '"') {
      const quoted = readQuoted(text, index, '"');
      token = { type: "string", value: quoted.value };
      index = quoted.end;
    } else if (char === "'") {
      const quoted = readQuoted(text, index, "'");
      token = { type: "char", value: quoted.value };
      index = quoted.end;
    } else if (isIdentifierStart(char)) {
      token = readIdentifier(text, index);
      index = token.end;
    } else if (isDigit(char) || (char === "." && isDigit(text[index + 1]))) {
      token = readNumber(text, index);
      index = token.end;
    } else {
      token = readPunctuator(text, index);
      index = token.end;
    }

    if (needsSpace(previous, token)) {
      output += " ";
    }
    output += token.value;
    previous = token;
  }

  return output;
}

function minifyC(text) {
  const lines = text.match(/[^\n]*\n?|[^\n]+$/g) ?? [];
  let output = "";
  let chunk = "";

  function flushChunk({ trailingNewline = false } = {}) {
    if (!chunk) return;
    output += minifyCodeChunk(chunk);
    if (trailingNewline && !output.endsWith("\n")) output += "\n";
    chunk = "";
  }

  for (const line of lines) {
    const hasNewline = line.endsWith("\n");
    const body = hasNewline ? line.slice(0, -1) : line;
    const trimmedStart = body.trimStart();

    if (trimmedStart.startsWith("#")) {
      flushChunk({ trailingNewline: true });
      output += body + (hasNewline ? "\n" : "");
      continue;
    }

    chunk += body;
    if (hasNewline) chunk += "\n";
  }

  flushChunk();
  return output;
}

const source = await Bun.file(inputPath).text();
const minified = minifyC(source);

await Bun.write(inputPath, minified);
