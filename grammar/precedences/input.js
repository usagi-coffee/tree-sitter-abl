// References: RUN STORED-PROCEDURE statement (parameter rules); Format phrase (VALIDATE notes).
module.exports = ($) => [
  // Purpose: avoid treating INPUT x as a named parameter body; prefer INPUT expression.
  // Example: myMethod(INPUT x = 1).
  [$._primary_expression, $.__input_expression_body],
  // Purpose: prefer explicit INPUT expression over bare identifiers.
  // Example: COLOR PROMPT INPUT field1 field2.
  [$.input_expression, $.identifier],
];
