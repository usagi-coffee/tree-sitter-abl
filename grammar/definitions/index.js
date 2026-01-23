const bufferDefinition = require("./buffer");
const classDefinition = require("./class");
const buttonDefinition = require("./button");
const datasetDefinition = require("./dataset");
const functionDefinition = require("./function");
const interfaceDefinition = require("./interface");
const imageDefinition = require("./image");
const parameterDefinition = require("./parameter");
const procedureDefinition = require("./procedure");
const queryDefinition = require("./query");
const streamDefinition = require("./stream");
const tempTableDefinition = require("./temp-table");
const variableDefinition = require("./variable");
const rectangleDefinition = require("./rectangle");
const eventDefinition = require("./event");
const menuDefinition = require("./menu");
const submenuDefinition = require("./submenu");
const frameDefinition = require("./frame");
const browseDefinition = require("./browse");

module.exports = (ctx) => ({
  ...bufferDefinition(ctx),
  ...buttonDefinition(ctx),
  ...datasetDefinition(ctx),
  ...classDefinition(ctx),
  ...imageDefinition(ctx),
  ...parameterDefinition(ctx),
  ...queryDefinition(ctx),
  ...tempTableDefinition(ctx),
  ...variableDefinition(ctx),
  ...procedureDefinition(ctx),
  ...functionDefinition(ctx),
  ...interfaceDefinition(ctx),
  ...streamDefinition(ctx),
  ...rectangleDefinition(ctx),
  ...eventDefinition(ctx),
  ...menuDefinition(ctx),
  ...submenuDefinition(ctx),
  ...frameDefinition(ctx),
  ...browseDefinition(ctx),
});
