// References: N/A (barrel for precedence groups).
// Purpose: compose all precedence groups in a stable, readable order.
const binary = require("./binary");
const caseStatement = require("./case");
const create = require("./create");
const display = require("./display");
const deleteStatement = require("./delete");
const browse = require("./browse");
const dataset = require("./dataset");
const enable = require("./enable");
const assign = require("./assign");
const exportStatement = require("./export");
const format = require("./format");
const input = require("./input");
const os = require("./os");
const put = require("./put");
const promptFor = require("./prompt-for");
const run = require("./run");
const set = require("./set");
const subscribe = require("./subscribe");
const update = require("./update");
const widget = require("./widget");
const include = require("./include");
const message = require("./message");
const record = require("./record");

module.exports = ($) => [
  ["unary", "multiplication", "add", "compare", "not", "logical"],
  ...binary($),
  ...os($),
  ...dataset($),
  ...browse($),
  ...include($),
  ...create($),
  ...deleteStatement($),
  ...caseStatement($),
  ...assign($),
  ...set($),
  ...enable($),
  ...display($),
  ...widget($),
  ...message($),
  ...record($),
  ...format($),
  ...put($),
  ...promptFor($),
  ...exportStatement($),
  ...input($),
  ...run($),
  ...subscribe($),
  ...update($),
];
