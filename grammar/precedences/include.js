// References: include expression / include statement.
export default ($) => [
  // Purpose: order standalone includes before include expressions and generic primary expressions.
  // Example: {inc.i} - 1.
  // Reference: include statement at top-level.
  [$.include_statement, $.include_expression, $._primary_expression],
];
