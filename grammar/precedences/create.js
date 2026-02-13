// References: CREATE BUFFER statement.
module.exports = ($) => [
  // Purpose: keep CREATE BUFFER statements from being interpreted as generic expression starts.
  // Example: CREATE BUFFER bh FOR TABLE tt.
  [$.__create_buffer, $.__object_access_handle_type],
  // Purpose: keep CREATE TEMP-TABLE statement from being interpreted as generic expression starts.
  // Example: CREATE TEMP-TABLE tt.
  [$.__create_temp_table_body, $.__object_access_handle_type],
  // Purpose: prefer CREATE BUFFER target over bare identifier.
  // Example: CREATE BUFFER hBuf FOR TABLE Customer IN WIDGET-POOL wp.
  [$.__create_buffer_target, $._identifier_or_qualified_name],
  // Purpose: prefer SQL CREATE PROCEDURE over ABL CREATE automation-object form.
  // Example: CREATE PROCEDURE p_calc AS SELECT 1;
  [$.sql_create_procedure_statement, $.__create_automation_object],
];
