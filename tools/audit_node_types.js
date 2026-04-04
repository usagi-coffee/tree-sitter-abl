#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_GRAMMAR_PATH = path.join(__dirname, "..", "src", "grammar.json");
const DEFAULT_LIMIT = 15;
const DEFAULT_MIN_SHARED_LENGTH = 2;

function parseArgs(argv) {
  const args = {
    path: DEFAULT_GRAMMAR_PATH,
    limit: DEFAULT_LIMIT,
    minSharedLength: DEFAULT_MIN_SHARED_LENGTH,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--path") {
      args.path = path.resolve(argv[++i]);
      continue;
    }

    if (arg === "--limit") {
      args.limit = Number(argv[++i]);
      continue;
    }

    if (arg === "--min-shared-length") {
      args.minSharedLength = Number(argv[++i]);
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node tools/audit_node_types.js [options]

Options:
  --path <file>               Path to grammar.json
  --limit <n>                 Max rows per report section (default: ${DEFAULT_LIMIT})
  --min-shared-length <n>     Minimum shared prefix/suffix item length to report (default: ${DEFAULT_MIN_SHARED_LENGTH})
`);
}

function readGrammar(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function unwrap(node) {
  let current = node;

  while (
    current &&
    ["ALIAS", "FIELD", "PREC", "PREC_LEFT", "PREC_RIGHT", "PREC_DYNAMIC"].includes(current.type)
  ) {
    current = current.content;
  }

  return current;
}

function keywordValue(node) {
  if (!node) {
    return null;
  }

  if (
    node.type === "ALIAS" &&
    typeof node.value === "string" &&
    /^[A-Z][A-Z0-9-]*$/.test(node.value)
  ) {
    return node.value;
  }

  if (node.type === "STRING" && /^[A-Z][A-Z0-9-]*$/.test(node.value)) {
    return node.value;
  }

  if (node.type === "TOKEN") {
    return keywordValue(node.content);
  }

  if (node.type === "PATTERN") {
    const pattern = node.value.replace(/\\/g, "");
    if (/^[A-Z][A-Z0-9-]*$/.test(pattern)) {
      return pattern;
    }
  }

  return null;
}

function itemFromNode(node) {
  if (!node) {
    return { key: "NULL", display: "null", kind: "other" };
  }

  const keyword = keywordValue(node);
  if (keyword) {
    return { key: `KW:${keyword}`, display: keyword, kind: "keyword" };
  }

  const unwrapped = unwrap(node);

  if (!unwrapped) {
    return { key: "NULL", display: "null", kind: "other" };
  }

  if (unwrapped.type === "SYMBOL") {
    return { key: `SYM:${unwrapped.name}`, display: `$${unwrapped.name}`, kind: "symbol" };
  }

  if (unwrapped.type === "STRING") {
    return {
      key: `LIT:${JSON.stringify(unwrapped.value)}`,
      display: JSON.stringify(unwrapped.value),
      kind: /[A-Za-z]/.test(unwrapped.value) ? "literal" : "punctuation",
    };
  }

  if (unwrapped.type === "BLANK") {
    return { key: "BLANK", display: "BLANK", kind: "blank" };
  }

  if (unwrapped.type === "CHOICE") {
    return {
      key: `CHOICE:${unwrapped.members.length}`,
      display: `choice(${unwrapped.members.length})`,
      kind: "choice",
    };
  }

  if (unwrapped.type === "SEQ") {
    return {
      key: `SEQ:${unwrapped.members.length}`,
      display: `seq(${unwrapped.members.length})`,
      kind: "sequence",
    };
  }

  if (
    unwrapped.type === "REPEAT" ||
    unwrapped.type === "REPEAT1" ||
    unwrapped.type === "OPTIONAL"
  ) {
    const inner = itemFromNode(unwrapped.content);
    return {
      key: `${unwrapped.type}:${inner.key}`,
      display: `${unwrapped.type.toLowerCase()}(${inner.display})`,
      kind: "repeat",
    };
  }

  return { key: `NODE:${unwrapped.type}`, display: unwrapped.type.toLowerCase(), kind: "other" };
}

function branchItems(node) {
  const unwrapped = unwrap(node);
  if (unwrapped?.type === "SEQ") {
    return unwrapped.members.map(itemFromNode);
  }

  return [itemFromNode(node)];
}

function formatItems(items) {
  return items.map((item) => item.display).join(" ");
}

function commonPrefixLength(branches) {
  const minLength = Math.min(...branches.map((branch) => branch.items.length));
  let index = 0;

  while (index < minLength) {
    const key = branches[0].items[index].key;
    if (branches.every((branch) => branch.items[index].key === key)) {
      index += 1;
      continue;
    }
    break;
  }

  return index;
}

function commonSuffixLength(branches) {
  const minLength = Math.min(...branches.map((branch) => branch.items.length));
  let index = 0;

  while (index < minLength) {
    const key = branches[0].items[branches[0].items.length - 1 - index].key;
    if (branches.every((branch) => branch.items[branch.items.length - 1 - index].key === key)) {
      index += 1;
      continue;
    }
    break;
  }

  return index;
}

function hasMeaningfulSharedItem(items) {
  return items.some((item) => !["blank", "punctuation"].includes(item.kind));
}

function findSharedGroups(branches, kind, minSharedLength) {
  const results = [];
  const seen = new Set();

  for (let i = 0; i < branches.length; i += 1) {
    for (let j = i + 1; j < branches.length; j += 1) {
      const sliceLength =
        kind === "prefix"
          ? commonPrefixLength([branches[i], branches[j]])
          : commonSuffixLength([branches[i], branches[j]]);

      if (sliceLength < minSharedLength) {
        continue;
      }

      const slice =
        kind === "prefix"
          ? branches[i].items.slice(0, sliceLength)
          : branches[i].items.slice(branches[i].items.length - sliceLength);

      if (!hasMeaningfulSharedItem(slice)) {
        continue;
      }

      const members = branches.filter((branch) => {
        if (branch.items.length < sliceLength) {
          return false;
        }

        const candidate =
          kind === "prefix"
            ? branch.items.slice(0, sliceLength)
            : branch.items.slice(branch.items.length - sliceLength);

        return candidate.every((item, index) => item.key === slice[index].key);
      });

      if (members.length < 2) {
        continue;
      }

      const branchIds = members.map((branch) => branch.id).sort((a, b) => a - b);
      const signature = `${kind}:${branchIds.join(",")}:${slice.map((item) => item.key).join("|")}`;

      if (seen.has(signature)) {
        continue;
      }

      seen.add(signature);
      results.push({
        kind,
        branchIds,
        branches: members,
        sharedItems: slice,
        sharedLength: sliceLength,
      });
    }
  }

  return results;
}

function summarizeNode(node) {
  const summary = {
    fields: 0,
    optionals: 0,
    repeats: 0,
    choices: 0,
    sequences: 0,
    keywords: 0,
    symbols: 0,
  };

  walk(node, (current) => {
    if (!current || typeof current !== "object") {
      return;
    }

    if (current.type === "FIELD") {
      summary.fields += 1;
    }

    const unwrapped = unwrap(current);
    if (!unwrapped) {
      return;
    }

    if (unwrapped.type === "OPTIONAL") {
      summary.optionals += 1;
    }

    if (unwrapped.type === "REPEAT" || unwrapped.type === "REPEAT1") {
      summary.repeats += 1;
    }

    if (unwrapped.type === "CHOICE") {
      summary.choices += 1;
    }

    if (unwrapped.type === "SEQ") {
      summary.sequences += 1;
    }

    if (keywordValue(current)) {
      summary.keywords += 1;
    }

    if (unwrapped.type === "SYMBOL") {
      summary.symbols += 1;
    }
  });

  return summary;
}

function inlineHelperScore(node, summary) {
  const unwrapped = unwrap(node);
  if (!unwrapped || !["CHOICE", "SEQ"].includes(unwrapped.type)) {
    return 0;
  }

  const memberCount = Array.isArray(unwrapped.members) ? unwrapped.members.length : 0;
  const branchWeight = unwrapped.type === "CHOICE" ? memberCount * 2 : memberCount;

  return (
    branchWeight +
    summary.fields * 2 +
    summary.optionals * 2 +
    summary.repeats * 2 +
    summary.choices * 2 +
    summary.sequences +
    Math.min(summary.keywords, 3)
  );
}

function nodeShape(node) {
  const unwrapped = unwrap(node);
  if (!unwrapped) {
    return "unknown";
  }

  if (unwrapped.type === "CHOICE" || unwrapped.type === "SEQ") {
    return `${unwrapped.type.toLowerCase()}(${unwrapped.members.length})`;
  }

  return unwrapped.type.toLowerCase();
}

function findInlineHelperReports(grammar) {
  const reports = [];

  for (const [ruleName, rule] of Object.entries(grammar.rules)) {
    walk(rule, (node, trail) => {
      if (!trail) {
        return;
      }

      const unwrapped = unwrap(node);
      if (!unwrapped || !["CHOICE", "SEQ"].includes(unwrapped.type)) {
        return;
      }

      if (!trail.includes("members[")) {
        return;
      }

      if (unwrapped.type === "CHOICE" && unwrapped.members.length < 2) {
        return;
      }

      if (unwrapped.type === "SEQ" && unwrapped.members.length < 4) {
        return;
      }

      const summary = summarizeNode(node);
      const score = inlineHelperScore(node, summary);

      if (score < 10) {
        return;
      }

      if (summary.fields === 0 && summary.optionals === 0 && summary.choices <= 1) {
        return;
      }

      reports.push({
        ruleName,
        location: `${ruleName} @ ${trail}`,
        nodeType: unwrapped.type.toLowerCase(),
        shape: nodeShape(node),
        score,
        summary,
      });
    });
  }

  return reports.sort((a, b) => {
    return b.score - a.score || a.location.localeCompare(b.location);
  });
}

function collectChoiceReports(grammar, minSharedLength) {
  const sharedPrefixReports = [];
  const sharedSuffixReports = [];

  for (const [ruleName, rule] of Object.entries(grammar.rules)) {
    let choiceIndex = 0;

    walk(rule, (node, trail) => {
      if (unwrap(node)?.type !== "CHOICE") {
        return;
      }

      choiceIndex += 1;
      const choice = unwrap(node);
      const branches = choice.members.map((member, index) => ({
        id: index,
        items: branchItems(member),
      }));

      const location = `${ruleName} :: choice#${choiceIndex}${trail ? ` @ ${trail}` : ""}`;

      for (const group of findSharedGroups(branches, "prefix", minSharedLength)) {
        sharedPrefixReports.push({
          ruleName,
          location,
          ...group,
        });
      }

      for (const group of findSharedGroups(branches, "suffix", minSharedLength)) {
        sharedSuffixReports.push({
          ruleName,
          location,
          ...group,
        });
      }
    });
  }

  return {
    sharedPrefixReports: dedupeContainedGroups(sharedPrefixReports, "prefix"),
    sharedSuffixReports: dedupeContainedGroups(sharedSuffixReports, "suffix"),
  };
}

function walk(node, visit, trail = "") {
  if (!node || typeof node !== "object") {
    return;
  }

  visit(node, trail);

  if (Array.isArray(node.members)) {
    node.members.forEach((member, index) => walk(member, visit, `${trail}members[${index}]`));
  }

  if (node.content) {
    walk(node.content, visit, `${trail}content`);
  }
}

function dedupeContainedGroups(rows, kind) {
  return rows
    .filter((row, index) => {
      return !rows.some((other, otherIndex) => {
        if (index === otherIndex) {
          return false;
        }

        if (row.location !== other.location) {
          return false;
        }

        if (row.branchIds.join(",") !== other.branchIds.join(",")) {
          return false;
        }

        if (row.sharedLength >= other.sharedLength) {
          return false;
        }

        const rowSignature = row.sharedItems.map((item) => item.key).join("|");
        const otherSignature = other.sharedItems.map((item) => item.key).join("|");

        if (kind === "prefix") {
          return otherSignature.startsWith(rowSignature);
        }

        return otherSignature.endsWith(rowSignature);
      });
    })
    .sort((a, b) => {
      return (
        b.sharedLength - a.sharedLength ||
        b.branches.length - a.branches.length ||
        a.location.localeCompare(b.location)
      );
    });
}

function shuffle(rows) {
  const shuffled = [...rows];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function renderSection(title, rows, renderRow) {
  console.log(`\n## ${title}`);
  if (rows.length === 0) {
    console.log("(none)");
    return;
  }

  rows.forEach((row, index) => {
    console.log(`${index + 1}. ${renderRow(row)}`);
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const grammar = readGrammar(args.path);
  const { sharedPrefixReports, sharedSuffixReports } = collectChoiceReports(
    grammar,
    args.minSharedLength,
  );
  const inlineHelperReports = findInlineHelperReports(grammar);

  console.log(`# Grammar Family Audit`);
  console.log(`file: ${path.relative(process.cwd(), args.path)}`);
  console.log(`rules: ${Object.keys(grammar.rules).length}`);
  console.log(`minimum shared length: ${args.minSharedLength}`);
  console.log(
    `note: this audit only reports direct choice-branch reuse opportunities from grammar.json.`,
  );

  renderSection(
    "Same-Rule Shared Suffixes",
    shuffle(sharedSuffixReports).slice(0, args.limit),
    (row) => {
      const branchBodies = row.branches.map((branch) => formatItems(branch.items)).join(" || ");
      return `${row.location} | ${row.branches.length} branches | shared suffix ${formatItems(row.sharedItems)} | suggest shared tail extraction | branches: ${branchBodies}`;
    },
  );

  renderSection(
    "Same-Rule Shared Prefixes",
    shuffle(sharedPrefixReports).slice(0, args.limit),
    (row) => {
      const branchBodies = row.branches.map((branch) => formatItems(branch.items)).join(" || ");
      return `${row.location} | ${row.branches.length} branches | shared prefix ${formatItems(row.sharedItems)} | suggest prefix split | branches: ${branchBodies}`;
    },
  );

  renderSection(
    "Extractable Inline Helpers",
    shuffle(inlineHelperReports).slice(0, args.limit),
    (row) => {
      return `${row.location} | ${row.shape} | score ${row.score} | fields ${row.summary.fields} | optionals ${row.summary.optionals} | repeats ${row.summary.repeats} | nested choices ${row.summary.choices} | suggest extracting a local helper rule`;
    },
  );
}

main();
