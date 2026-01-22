const bufferDefinition = require("./buffer");
const classDefinition = require("./class");
const buttonDefinition = require("./button");
const datasetDefinition = require("./dataset");
const functionDefinition = require("./function");
const interfaceDefinition = require("./interface");
const imageDefinition = require("./image");
const procedureDefinition = require("./procedure");
const queryDefinition = require("./query");
const streamDefinition = require("./stream");
const tempTableDefinition = require("./temp-table");
const variableDefinition = require("./variable");

module.exports = (ctx) => ({
  ...bufferDefinition(ctx),
  ...buttonDefinition(ctx),
  ...datasetDefinition(ctx),
  ...classDefinition(ctx),
  ...imageDefinition(ctx),
  ...queryDefinition(ctx),
  ...tempTableDefinition(ctx),
  ...variableDefinition(ctx),
  ...procedureDefinition(ctx),
  ...functionDefinition(ctx),
  ...interfaceDefinition(ctx),
  ...streamDefinition(ctx),
});
