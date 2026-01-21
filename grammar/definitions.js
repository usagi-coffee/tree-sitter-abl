const bufferDefinition = require("./definitions/buffer");
const classDefinition = require("./definitions/class");
const buttonDefinition = require("./definitions/button");
const datasetDefinition = require("./definitions/dataset");
const functionDefinition = require("./definitions/function");
const interfaceDefinition = require("./definitions/interface");
const imageDefinition = require("./definitions/image");
const procedureDefinition = require("./definitions/procedure");
const queryDefinition = require("./definitions/query");
const streamDefinition = require("./definitions/stream");
const tempTableDefinition = require("./definitions/temp-table");
const variableDefinition = require("./definitions/variable");

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
