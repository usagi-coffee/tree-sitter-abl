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

function dedupeEntries(entries, getKey) {
  const seen = new Set();
  const result = [];

  for (const entry of entries) {
    const key = getKey(entry);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(entry);
  }

  return result;
}

const files = fs
  .readdirSync(statementsDir)
  .filter((filename) => filename.endsWith(".js") && filename !== "index.js")
  .sort();

const fileData = new Map();
const definitionOwners = new Map();
const externalUsages = new Map();
let foundIssues = false;

for (const filename of files) {
  const filePath = path.join(statementsDir, filename);
  const source = fs.readFileSync(filePath, "utf8");
  const lines = source.split("\n");
  const expectedPrefix = `__${normalizeBaseName(filename)}_`;
  const definitions = collectDefinitions(lines);
  const references = collectReferences(lines);

  fileData.set(filename, { expectedPrefix, definitions, references });

  for (const [name, lineNumber] of definitions) {
    if (!definitionOwners.has(name)) definitionOwners.set(name, []);
    definitionOwners.get(name).push({ filename, lineNumber });
  }
}

for (const filename of files) {
  const { expectedPrefix, definitions, references } = fileData.get(filename);

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

    const owners = definitionOwners.get(name) || [];

    for (const owner of owners) {
      if (owner.filename === filename) continue;

      if (!externalUsages.has(name)) {
        externalUsages.set(name, { owners: [], consumers: [] });
      }

      const usage = externalUsages.get(name);
      usage.owners.push(owner);
      usage.consumers.push({ filename, lineNumbers });
    }
  }

  console.log("");
}

const sharedRules = [...externalUsages.entries()]
  .map(([name, usage]) => ({
    name,
    owners: dedupeEntries(usage.owners, (entry) => `${entry.filename}:${entry.lineNumber}`),
    consumers: dedupeEntries(
      usage.consumers,
      (entry) => `${entry.filename}:${formatLineList(entry.lineNumbers)}`,
    ),
  }))
  .sort((left, right) => left.name.localeCompare(right.name));

if (sharedRules.length > 0) {
  foundIssues = true;
  console.log("Shared private-rule usage across statement files:");
  console.log("");

  for (const rule of sharedRules) {
    const ownerText = rule.owners
      .map((owner) => `${owner.filename}:${owner.lineNumber}`)
      .sort()
      .join(", ");
    const consumerText = rule.consumers
      .map((consumer) => `${consumer.filename}:${formatLineList(consumer.lineNumbers)}`)
      .sort()
      .join(", ");

    console.log(`${rule.name}`);
    console.log(`  owner: ${ownerText}`);
    console.log(`  consumers: ${consumerText}`);
    console.log("");
  }
}

if (!foundIssues) {
  console.log("No mismatched private statement rule prefixes found.");
}
