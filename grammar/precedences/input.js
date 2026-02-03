// References: RUN STORED-PROCEDURE statement (parameter rules); Format phrase (VALIDATE notes).
module.exports = ($) => [
  // Purpose: avoid treating INPUT x as a named parameter body; prefer INPUT expression.
  // Example: myMethod(INPUT x = 1).
  [$._primary_expression, $.__input_expression_body],
  // Purpose: prefer function call when INPUT target is followed by '('.
  // Example: ACCUMULATE INPUT myFunc().
  [$.function_call, $.__input_expression_body],
  // Purpose: treat tokens after INPUT THROUGH program as arguments, not program name.
  // Example: INPUT THROUGH prog arg1.
  [$.__input_through_arg_value, $._identifier_or_qualified_name],
  // Purpose: prefer function call when THROUGH argument uses '('.
  // Example: INPUT THROUGH prog myFunc().
  [$.function_call, $.__input_through_arg_value],
  // Purpose: prefer explicit INPUT expression over bare identifiers.
  // Example: COLOR PROMPT INPUT field1 field2.
  [$.input_expression, $.identifier],
];
