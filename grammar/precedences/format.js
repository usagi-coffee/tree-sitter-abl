// References: Format phrase.
export default ($) => [
  // Purpose: continue a numeric AT position when an expression operator follows.
  // Example: DISPLAY x AT COL 5 - 1 ROW 3.
  // Reference: AT phrase.
  [$._primary_expression, $.__format_at_single_position],
  // Purpose: prefer the documented paired AT coordinate form over a standalone compatibility position.
  // Example: DISPLAY x AT COL 5 ROW 3.
  // Reference: AT phrase.
  [$.__format_at_phrase, $.__format_at_single_position],
  // Purpose: parse FORMAT (...) as format target, not parenthesized expression start.
  // Example: FORMAT ("x(10)").
  // Reference: format-phrase.
  [$._format_format, $._primary_expression],
  // Purpose: keep FORMAT (...) on the format target path after extracting the expression opener.
  // Example: FORMAT ("x(10)").
  // Reference: format-phrase.
  [$._format_format, $.__parenthesized_expression_prefix],
  // Purpose: when FORMAT is followed by identifier-like text, keep it inside format_phrase.
  // Example: PUT x FORMAT decF.
  // Reference: FORMAT option in format-phrase.
  [$._format_format, $._identifier_or_qualified_name],
  // Purpose: avoid treating FORMAT target as a function call start (`fmt(`) in ambiguous contexts.
  // Example: SET p FORMAT fmt(x).
  // Reference: format-phrase disambiguation.
  [$._format_format, $.function_call],
];
