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
  _definition: ($) =>
    choice(
      $.buffer_definition,
      $.temp_table_definition,
      $.work_table_definition,
      $.workfile_definition,
      $.variable_definition,
      $.parameter_definition,
      $.procedure_definition,
      $.procedure_forward_definition,
      $.function_definition,
      $.function_forward_definition,
      $.stream_definition,
      $.image_definition,
      $.query_definition,
      $.class_definition,
      $.interface_definition,
      $.dataset_definition,
      $.button_definition,
    ),

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
