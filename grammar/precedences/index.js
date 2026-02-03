// References: N/A (barrel for precedence groups).
// Purpose: compose all precedence groups in a stable, readable order.
const binary = require("./binary");
const caseStatement = require("./case");
const create = require("./create");
const display = require("./display");
const deleteStatement = require("./delete");
const enable = require("./enable");
const assign = require("./assign");
const exportStatement = require("./export");
const input = require("./input");
const put = require("./put");
const promptFor = require("./prompt-for");
const run = require("./run");
const set = require("./set");
const update = require("./update");
const widget = require("./widget");
const inFrame = require("./in-frame");

module.exports = ($) => [
  ["unary", "multiplication", "add", "compare", "not", "logical"],
  ...binary($),
  ...create($),
  ...deleteStatement($),
  ...caseStatement($),
  ...assign($),
  ...set($),
  ...inFrame($),
  ...enable($),
  ...display($),
  ...widget($),
  ...put($),
  ...promptFor($),
  ...exportStatement($),
  ...input($),
  ...run($),
  ...update($),
];
