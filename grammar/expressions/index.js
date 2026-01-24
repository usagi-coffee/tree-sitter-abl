const availableExpression = require("./available");
const canFindExpression = require("./can-find");
const conditionalExpression = require("./conditional");
const aggregateExpression = require("./aggregate");
const datasetExpression = require("./dataset");
const lockedExpression = require("./locked");
const newExpression = require("./new");

module.exports = (ctx) => ({
  ...conditionalExpression(ctx),
  ...availableExpression(ctx),
  ...canFindExpression(ctx),
  ...lockedExpression(ctx),
  ...newExpression(ctx),
  ...aggregateExpression(ctx),
  ...datasetExpression(ctx),
});
