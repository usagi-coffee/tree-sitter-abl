#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_NODE_TYPES_PATH = path.join(__dirname, "..", "src", "node-types.json");
const DEFAULT_LIMIT = 15;
const DEFAULT_WIDE_THRESHOLD = 8;

function parseArgs(argv) {
  const args = {
    path: DEFAULT_NODE_TYPES_PATH,
    limit: DEFAULT_LIMIT,
    wideThreshold: DEFAULT_WIDE_THRESHOLD,
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

    if (arg === "--wide-threshold") {
      args.wideThreshold = Number(argv[++i]);
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
  --path <file>             Path to node-types.json
  --limit <n>               Max rows per report section (default: ${DEFAULT_LIMIT})
  --wide-threshold <n>      Minimum union width to flag a field/children entry (default: ${DEFAULT_WIDE_THRESHOLD})
`);
}

function readNodeTypes(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getTypes(schema) {
  return [...(schema?.types ?? [])].map((type) => `${type.named ? "n" : "a"}:${type.type}`).sort();
}

function formatTypes(schema) {
  return getTypes(schema)
    .map((type) => type.slice(2))
    .join(", ");
}

function fieldEntries(node) {
  return Object.entries(node.fields ?? {})
    .map(([name, schema]) => ({
      kind: "field",
      name,
      required: Boolean(schema.required),
      multiple: Boolean(schema.multiple),
      types: getTypes(schema),
      width: schema.types?.length ?? 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function childEntry(node) {
  if (!node.children) {
    return null;
  }

  return {
    kind: "children",
    name: "children",
    required: Boolean(node.children.required),
    multiple: Boolean(node.children.multiple),
    types: getTypes(node.children),
    width: node.children.types?.length ?? 0,
  };
}

function nodeBranchScore(node) {
  const fields = fieldEntries(node);
  const children = childEntry(node);
  return fields.reduce((sum, field) => sum + field.width, 0) + (children?.width ?? 0);
}

function shapeSignature(node) {
  const fields = fieldEntries(node).map(
    (field) =>
      `f:${field.name}:${field.required ? "req" : "opt"}:${field.multiple ? "many" : "one"}:[${field.types.join("|")}]`,
  );
  const children = childEntry(node);
  const childSignature = children
    ? [
        `c:${children.required ? "req" : "opt"}:${children.multiple ? "many" : "one"}:[${children.types.join("|")}]`,
      ]
    : [];
  return [...fields, ...childSignature].join(";");
}

function isConcreteNamedNode(node) {
  return node.named && !node.subtypes;
}

function isStatementLike(type) {
  return /(_statement|_definition|_phrase)$/.test(type);
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

function buildBroadNodeReport(nodes) {
  return nodes
    .filter(isConcreteNamedNode)
    .map((node) => ({
      type: node.type,
      branchScore: nodeBranchScore(node),
      fieldCount: fieldEntries(node).length,
      childWidth: childEntry(node)?.width ?? 0,
      technique: "body extraction / local alternative extraction",
    }))
    .filter((row) => row.branchScore > 0)
    .sort((a, b) => b.branchScore - a.branchScore || a.type.localeCompare(b.type));
}

function buildWideUnionReport(nodes, wideThreshold) {
  const rows = [];

  for (const node of nodes.filter(isConcreteNamedNode)) {
    for (const field of fieldEntries(node)) {
      if (field.width >= wideThreshold) {
        rows.push({
          node: node.type,
          target: `field:${field.name}`,
          width: field.width,
          required: field.required,
          multiple: field.multiple,
          types: field.types,
          technique: "narrow helper / local alternative extraction",
        });
      }
    }

    const children = childEntry(node);
    if (children && children.width >= wideThreshold) {
      rows.push({
        node: node.type,
        target: "children",
        width: children.width,
        required: children.required,
        multiple: children.multiple,
        types: children.types,
        technique: "body extraction / dispatcher split",
      });
    }
  }

  return rows.sort((a, b) => b.width - a.width || a.node.localeCompare(b.node));
}

function buildDuplicateShapeReport(nodes) {
  const groups = new Map();

  for (const node of nodes.filter(isConcreteNamedNode)) {
    const signature = shapeSignature(node);
    if (!signature) {
      continue;
    }

    const group = groups.get(signature) ?? [];
    group.push(node.type);
    groups.set(signature, group);
  }

  return [...groups.entries()]
    .map(([signature, types]) => ({ signature, types }))
    .filter((row) => row.types.length > 1)
    .sort((a, b) => b.types.length - a.types.length || a.types[0].localeCompare(b.types[0]))
    .map((row) => ({
      ...row,
      statementTypes: row.types.filter(isStatementLike),
      technique: "tail extraction / local family helper",
    }));
}

function buildWrapperReport(nodes) {
  const rows = [];

  for (const node of nodes.filter(isConcreteNamedNode)) {
    const fields = fieldEntries(node);
    const children = childEntry(node);

    if (fields.length === 1 && !children) {
      const [field] = fields;
      if (field.required && !field.multiple && field.width === 1) {
        rows.push({
          node: node.type,
          shape: `single field '${field.name}' -> ${field.types[0].slice(2)}`,
          technique: "wrapper cleanup / alias-at-callsite review",
        });
      }
    }

    if (
      fields.length === 0 &&
      children &&
      children.required &&
      !children.multiple &&
      children.width === 1
    ) {
      rows.push({
        node: node.type,
        shape: `single child -> ${children.types[0].slice(2)}`,
        technique: "body helper review / trivial wrapper cleanup",
      });
    }
  }

  return rows.sort((a, b) => a.node.localeCompare(b.node));
}

function buildRepeatedFieldSchemaReport(nodes) {
  const groups = new Map();

  for (const node of nodes.filter(isConcreteNamedNode)) {
    for (const field of fieldEntries(node)) {
      const signature = `${field.name}:${field.required ? "req" : "opt"}:${field.multiple ? "many" : "one"}:[${field.types.join("|")}]`;
      const group = groups.get(signature) ?? [];
      group.push(node.type);
      groups.set(signature, group);
    }
  }

  return [...groups.entries()]
    .map(([signature, types]) => ({ signature, types }))
    .filter((row) => row.types.length > 2)
    .sort((a, b) => b.types.length - a.types.length || a.signature.localeCompare(b.signature))
    .map((row) => ({
      ...row,
      technique: "shared option family / local alternative extraction",
    }));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const nodes = readNodeTypes(args.path);

  const broadNodes = buildBroadNodeReport(nodes).slice(0, args.limit);
  const wideUnions = buildWideUnionReport(nodes, args.wideThreshold).slice(0, args.limit);
  const duplicateShapes = buildDuplicateShapeReport(nodes).slice(0, args.limit);
  const wrappers = buildWrapperReport(nodes).slice(0, args.limit);
  const repeatedFieldSchemas = buildRepeatedFieldSchemaReport(nodes).slice(0, args.limit);

  console.log(`# Node Types Audit`);
  console.log(`file: ${path.relative(process.cwd(), args.path)}`);
  console.log(`named concrete nodes: ${nodes.filter(isConcreteNamedNode).length}`);
  console.log(`wide union threshold: ${args.wideThreshold}`);
  console.log(
    `note: this is heuristic-only; node-types cannot see hidden helpers, token ordering, precedence, or keyword prefixes.`,
  );

  renderSection("Broad Nodes", broadNodes, (row) => {
    return `${row.type} | branch score ${row.branchScore} | ${row.fieldCount} fields | child width ${row.childWidth} | suggest ${row.technique}`;
  });

  renderSection("Wide Unions", wideUnions, (row) => {
    return `${row.node} ${row.target} | width ${row.width} | ${row.required ? "required" : "optional"} ${row.multiple ? "many" : "one"} | suggest ${row.technique}`;
  });

  renderSection("Duplicate Node Shapes", duplicateShapes, (row) => {
    const focus =
      row.statementTypes.length > 1 ? ` | statement-like: ${row.statementTypes.join(", ")}` : "";
    return `${row.types.length} nodes share a shape | ${row.types.join(", ")}${focus} | suggest ${row.technique}`;
  });

  renderSection("Wrapper-Like Nodes", wrappers, (row) => {
    return `${row.node} | ${row.shape} | suggest ${row.technique}`;
  });

  renderSection("Repeated Field Schemas", repeatedFieldSchemas, (row) => {
    return `${row.types.length} nodes share ${row.signature} | ${row.types.join(", ")} | suggest ${row.technique}`;
  });
}

main();
