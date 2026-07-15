// References: include expression / include statement.
export default ($) => [
  // Purpose: order standalone includes before include expressions and generic primary expressions.
  // Example: {inc.i} - 1.
  // Reference: include statement at top-level.
  [$.include_statement, $.include_expression, $._primary_expression],
  // Purpose: keep NEW/WINDOW as positional include arguments over constructor and widget reductions.
  // Example: {include.i NEW WINDOW {&next-argument}}
  // Reference: include positional arguments.
  [$._include_argument_value, $.__new_prefix, $._widgets],
  // Purpose: keep an include argument reference in the positional-argument path.
  // Example: {include.i {1} -1}
  // Reference: include positional arguments.
  [$._include_argument_value, $._primary_expression],
  // Purpose: finish a function call before reducing its name as a positional include argument.
  // Example: {include.i myFunc()}
  // Reference: include positional arguments.
  [$.function_call, $._include_argument_value],
  // Purpose: end a completed expression before a following signed include argument.
  // Example: {include.i a -1}
  // Reference: include positional arguments.
  [$._include_argument_value, $._expression],
];
