const availableExpression = require("./available");
const canFindExpression = require("./can-find");
const conditionalExpression = require("./conditional");
const aggregateExpression = require("./aggregate");
const datasetExpression = require("./dataset");
const functionExpression = require("./function");
const lockedExpression = require("./locked");
const newExpression = require("./new");

module.exports = (ctx) => {
  return {
    ...conditionalExpression(ctx),
    ...availableExpression(ctx),
    ...canFindExpression(ctx),
    ...lockedExpression(ctx),
    ...newExpression(ctx),
    ...aggregateExpression(ctx),
    ...functionExpression(ctx),
    ...datasetExpression(ctx),
  };
};
