// References: include expression / include statement.
module.exports = ($) => [
  // Purpose: parse standalone includes as statements when ambiguous with expression starts.
  // Example: {inc.i} - 1.
  // Reference: include statement at top-level.
  [$.include_statement, $._primary_expression],
];
