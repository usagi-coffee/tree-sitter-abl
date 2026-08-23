// References: Format phrase.
export default ($) => [
  // Purpose: prefer expression continuation over the merged AT coordinate alternatives.
  // Example: DISPLAY x AT COL 5 - 1 ROW 3.
  // Reference: AT phrase.
  [$._primary_expression, $.__format_at_phrase],
  // Purpose: parse FORMAT (...) as format target, not parenthesized expression start.
  // Example: FORMAT ("x(10)").
  // Reference: format-phrase.
  [$._format_format, $._primary_expression],
  // Purpose: keep FORMAT (...) on the format target path after extracting the expression opener.
  // Example: FORMAT ("x(10)").
  // Reference: format-phrase.
  [$._format_format, $._parenthesized_expression_prefix],
  // Purpose: when FORMAT is followed by identifier-like text, keep it inside format_phrase.
  // Example: PUT x FORMAT decF.
  // Reference: FORMAT option in format-phrase.
  [$._format_format, $._identifier_or_qualified_name],
  // Purpose: avoid treating FORMAT target as a function call start (`fmt(`) in ambiguous contexts.
  // Example: SET p FORMAT fmt(x).
  // Reference: format-phrase disambiguation.
  [$._format_format, $.function_call],
];
