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
  // Purpose: keep CREATE DATASET handle syntax ahead of a DATASET expression prefix.
  // Example: CREATE DATASET hDataset.
  // Reference: CREATE statement handle forms.
  [$.__create_handle_with_pool_body, $.__dataset_expression_prefix],
];
