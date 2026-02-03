// References: CREATE BUFFER statement.
module.exports = ($) => [
  // Purpose: prefer CREATE BUFFER target over bare identifier.
  // Example: CREATE BUFFER hBuf FOR TABLE Customer IN WIDGET-POOL wp.
  [$.__create_buffer_target, $._identifier_or_qualified_name],
];
