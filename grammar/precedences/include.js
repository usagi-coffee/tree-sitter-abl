// References: include expression / include statement.
export default ($) => [
  // Purpose: order standalone includes before include expressions and generic expressions.
  // Example: {inc.i} - 1.
  // Reference: include statement at top-level.
  [$.include_statement, $.include_expression, $._expression],
  // Purpose: keep NEW/WINDOW as positional include arguments over constructor and widget reductions.
  // Example: {include.i NEW WINDOW {&next-argument}}
  // Reference: include positional arguments.
  [$._include_argument_value, $.new_expression, $._widgets],
  // Purpose: keep an include argument reference in the positional-argument path.
  // Example: {include.i {1} -1}
  // Also end completed expressions before following signed include arguments: {include.i a -1}.
  // Reference: include positional arguments.
  [$._include_argument_value, $._expression],
  // Purpose: IN separates two positional include arguments; it does not qualify
  // the preceding one by a widget, since arguments are unexpanded tokens.
  // Example: {foreach.i CoreObjPostit vPostit in CollectionPostit}
  // Reference: include positional arguments; Widget phrase.
  [$._include_argument_value, $.widget_qualified_name],
  // Purpose: finish a function call before reducing its name as a positional include argument.
  // Example: {include.i myFunc()}
  // Reference: include positional arguments.
  [$.function_call, $._include_argument_value],
];
