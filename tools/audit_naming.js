const fs = require("node:fs");
const path = require("node:path");

const statementsDir = path.resolve(__dirname, "../grammar/statements");

function normalizeBaseName(filename) {
  return path.basename(filename, ".js").replace(/-/g, "_");
}

function addIssue(map, key, entry) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(entry);
}

function collectDefinitions(lines) {
  const definitions = new Map();

  for (const [index, line] of lines.entries()) {
    const match = line.match(/\b(__[A-Za-z0-9_]+)\s*:\s*\(\$\)\s*=>/);

    if (match) {
      definitions.set(match[1], index + 1);
    }
  }

  return definitions;
}

function collectReferences(lines) {
  const references = new Map();

  for (const [index, line] of lines.entries()) {
    for (const match of line.matchAll(/\$\.(__([A-Za-z0-9_]+))/g)) {
      addIssue(references, match[1], index + 1);
    }
  }

  return references;
}

function formatLineList(lineNumbers) {
  return [...new Set(lineNumbers)].sort((a, b) => a - b).join(", ");
}

const files = fs
  .readdirSync(statementsDir)
  .filter((filename) => filename.endsWith(".js") && filename !== "index.js")
  .sort();

let foundIssues = false;

for (const filename of files) {
  const filePath = path.join(statementsDir, filename);
  const source = fs.readFileSync(filePath, "utf8");
  const lines = source.split("\n");
  const expectedPrefix = `__${normalizeBaseName(filename)}_`;
  const definitions = collectDefinitions(lines);
  const references = collectReferences(lines);

  const badDefinitions = [...definitions.entries()].filter(
    ([name]) => !name.startsWith(expectedPrefix),
  );
  const badReferences = [...references.entries()].filter(
    ([name]) => !name.startsWith(expectedPrefix),
  );

  if (badDefinitions.length === 0 && badReferences.length === 0) continue;

  foundIssues = true;
  console.log(`${filename} expected ${expectedPrefix}*`);

  for (const [name, lineNumber] of badDefinitions) {
    console.log(`  def ${name} at line ${lineNumber}`);
  }

  for (const [name, lineNumbers] of badReferences) {
    console.log(`  ref ${name} at lines ${formatLineList(lineNumbers)}`);
  }

  console.log("");
}

if (!foundIssues) {
  console.log("No mismatched private statement rule prefixes found.");
}
