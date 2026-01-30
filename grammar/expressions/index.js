const availableExpression = require("./available");
const canFindExpression = require("./can-find");
const conditionalExpression = require("./conditional");
const datasetExpression = require("./dataset");
const lockedExpression = require("./locked");
const newExpression = require("./new");
const currentChangedExpression = require("./current-changed");
const ambiguousExpression = require("./ambiguous");
const inFrameExpression = require("./in-frame");
const inputExpression = require("./input");
const accumExpression = require("./accum");
const frameExpression = require("./frame");
const menuExpression = require("./menu");
const queryExpression = require("./query");
const menu_item_access = require("./menu-item");

module.exports = (ctx) => ({
  ...conditionalExpression(ctx),
  ...availableExpression(ctx),
  ...canFindExpression(ctx),
  ...lockedExpression(ctx),
  ...newExpression(ctx),
  ...datasetExpression(ctx),
  ...currentChangedExpression(ctx),
  ...ambiguousExpression(ctx),
  ...accumExpression(ctx),
  ...inputExpression(ctx),
  ...inFrameExpression(ctx),
  ...frameExpression(ctx),
  ...menuExpression(ctx),
  ...queryExpression(ctx),
  ...menu_item_access(ctx),
});
