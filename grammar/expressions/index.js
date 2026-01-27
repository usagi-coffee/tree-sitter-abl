const availableExpression = require("./available");
const canFindExpression = require("./can-find");
const conditionalExpression = require("./conditional");
const aggregateExpression = require("./aggregate");
const datasetExpression = require("./dataset");
const lockedExpression = require("./locked");
const newExpression = require("./new");
const currentChangedExpression = require("./current-changed");
const ambiguousExpression = require("./ambiguous");
const inFrameExpression = require("./in-frame");
const inputExpression = require("./input");
const accumExpression = require("./accum");

module.exports = (ctx) => ({
  ...conditionalExpression(ctx),
  ...availableExpression(ctx),
  ...canFindExpression(ctx),
  ...lockedExpression(ctx),
  ...newExpression(ctx),
  ...aggregateExpression(ctx),
  ...datasetExpression(ctx),
  ...currentChangedExpression(ctx),
  ...ambiguousExpression(ctx),
  ...accumExpression(ctx),
  ...inputExpression(ctx),
  ...inFrameExpression(ctx),
});
