import { resolve } from "node:path";
import { readFileSync, readdirSync } from "node:fs";

export function rootMetadataSymbols(context, properties) {
  const root = resolve(context.cwd, "grammar.js");
  let source;
  try {
    source =
      resolve(context.filename) === root
        ? context.sourceCode.getText()
        : readFileSync(root, "utf8");
  } catch {
    return new Set();
  }
  // Read static metadata arrays without executing the project's grammar module.
  // Keep literals opaque so comments and strings cannot supply metadata entries.
  const tokens =
    source.match(
      /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|[$A-Z_a-z][$\w]*|=>|[^\s]/g,
    ) ?? [];
  const code = tokens.filter((part) => !part.startsWith("//") && !part.startsWith("/*"));
  const names = new Set();
  for (let i = 0; i < code.length - 6; i++) {
    if (!properties.includes(code[i]) || code.slice(i + 1, i + 7).join(" ") !== ": ( $ ) => [")
      continue;
    let depth = 1;
    for (let j = i + 7; j < code.length && depth > 0; j++) {
      if (code[j] === "[") depth++;
      if (code[j] === "]") depth--;
      if (code[j] === "$" && code[j + 1] === "." && /^[$A-Z_a-z][$\w]*$/.test(code[j + 2] ?? ""))
        names.add(code[j + 2]);
    }
  }
  return names;
}

export function rootInlineSymbols(context) {
  return rootMetadataSymbols(context, ["inline"]);
}

export function keywordInlineSymbols(context) {
  const names = rootInlineSymbols(context),
    sources = [context.sourceCode.getText()],
    filename = resolve(context.cwd, "grammar", "keywords.js");
  try {
    if (resolve(context.filename) !== filename) sources.push(readFileSync(filename, "utf8"));
  } catch {}
  for (const source of sources) {
    const code = (
      source.match(
        /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|[$A-Z_a-z][$\w]*|=>|[^\s]/g,
      ) ?? []
    ).filter((part) => !part.startsWith("//") && !part.startsWith("/*"));
    for (let index = 0; index < code.length - 8; index++) {
      if (code.slice(index, index + 9).join(" ") !== "export const inline = ( $ ) => [") continue;
      let depth = 1;
      for (let next = index + 9; next < code.length && depth > 0; next++) {
        if (code[next] === "[") depth++;
        if (code[next] === "]") depth--;
        if (
          code[next] === "$" &&
          code[next + 1] === "." &&
          /^[$A-Z_a-z][$\w]*$/.test(code[next + 2] ?? "")
        )
          names.add(code[next + 2]);
      }
    }
  }
  return names;
}

export function projectPrecedenceSymbols(context) {
  const names = rootMetadataSymbols(context, ["precedences"]);
  try {
    const directory = resolve(context.cwd, "grammar", "precedences");
    for (const file of readdirSync(directory)) {
      if (!file.endsWith(".js")) continue;
      const source = readFileSync(resolve(directory, file), "utf8");
      const tokens =
        source.match(
          /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|[$A-Z_a-z][$\w]*|=>|[^\s]/g,
        ) ?? [];
      const code = tokens.filter((part) => !part.startsWith("//") && !part.startsWith("/*"));
      for (let index = 0; index < code.length - 2; index++) {
        if (
          code[index] === "$" &&
          code[index + 1] === "." &&
          /^[$A-Z_a-z][$\w]*$/.test(code[index + 2])
        )
          names.add(code[index + 2]);
      }
    }
  } catch {}
  return names;
}
