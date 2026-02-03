// References: expression parsing.
module.exports = ($) => [
  // Purpose: prefer function call when identifier is followed by args.
  // Example: ACCUMULATE myFunc(x).
  [$.function_call, $._primary_expression],
  // Purpose: prefer ACCUMULATE aggregate list over treating as function call.
  // Example: ACCUMULATE balance (TOTAL).
  [$.__accumulate_item, $.function_call],
  // Purpose: treat bare identifier as target, not function call, in ACCUMULATE.
  // Example: ACCUMULATE balance (TOTAL).
  [$.__accumulate_primary_expression, $.function_call],
  // Purpose: prefer aggregate target for DISPLAY (arg ref followed by agg list).
  // Example: DISPLAY x (TOTAL).
  [$.__display_aggregate_primary_expression, $._primary_expression],
  [$.__display_aggregate_primary_expression, $.function_call, $._primary_expression],
  // Purpose: prefer aggregate expression path in DISPLAY before generic expression.
  // Example: DISPLAY x (TOTAL).
  [$.__display_aggregate_expression, $._expression],
  // Purpose: prefer identifier/qualified name where it competes with primary expression.
  // Example: DISPLAY customer WITH BROWSE b.
  [$._identifier_or_qualified_name, $._primary_expression],
  // Purpose: prefer object access over plain identifier/qualified name when ':' follows.
  // Example: MENU:ITEM.
  [$.object_access, $.qualified_name, $.identifier],
];
