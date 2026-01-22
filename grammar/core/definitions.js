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
});
