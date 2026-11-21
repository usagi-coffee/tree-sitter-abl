import { resolve } from "node:path";
import { existsSync, readFileSync, readdirSync } from "node:fs";

export function staticSourceTokens(source) {
  return (
    source.match(
      /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|[$A-Z_a-z][$\w]*|=>|[^\s]/g,
    ) ?? []
  ).filter((part) => !part.startsWith("//") && !part.startsWith("/*"));
}

export function usedOutsideFile(
  context,
  nameOrMatch,
  { wholeName = false, except = [], caseInsensitiveLiteral = false } = {},
) {
  const filename = resolve(context.cwd, context.filename);
  const directory = resolve(context.cwd, "grammar");
  const root = resolve(context.cwd, "grammar.js");
  const files = existsSync(root) ? [root] : [];
  try {
    if (existsSync(directory)) {
      for (const entry of readdirSync(directory, { recursive: true })) {
        if (entry.endsWith(".js")) files.push(resolve(directory, entry));
      }
    }
    const matchesTokens = typeof nameOrMatch === "function" ? nameOrMatch : null;
    const name = matchesTokens ? "" : nameOrMatch;
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const whole = wholeName ? new RegExp(`(?<![$\\w])${escapedName}(?![$\\w])`) : null;
    const literal = caseInsensitiveLiteral
      ? new RegExp("^([\"'`])" + escapedName + "\\1$", "i")
      : null;
    return files.some((file) => {
      if (file === filename || except.includes(file)) return false;
      const source = readFileSync(file, "utf8");
      if (matchesTokens) return matchesTokens(staticSourceTokens(source));
      if (literal) return staticSourceTokens(source).some((token) => literal.test(token));
      return whole ? whole.test(source) : source.includes(name);
    });
  } catch {
    return true;
  }
}

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
  // Read static metadata without executing the project's grammar module.
  // Keep literals opaque so comments and strings cannot supply metadata entries.
  const code = staticSourceTokens(source);
  const names = new Set();
  for (let i = 0; i < code.length - 6; i++) {
    if (!properties.includes(code[i]) || code.slice(i + 1, i + 6).join(" ") !== ": ( $ ) =>")
      continue;
    if (
      code[i + 6] === "$" &&
      code[i + 7] === "." &&
      /^[$A-Z_a-z][$\w]*$/.test(code[i + 8] ?? "") &&
      [",", "}"].includes(code[i + 9])
    ) {
      names.add(code[i + 8]);
      continue;
    }
    if (code[i + 6] !== "[") continue;
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
    const code = staticSourceTokens(source);
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
      const code = staticSourceTokens(source);
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
