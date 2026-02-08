// References: Format phrase.
module.exports = ($) => [
  // Purpose: parse FORMAT (...) as format target, not parenthesized expression start.
  // Example: FORMAT ("x(10)").
  // Reference: format-phrase.
  [$.__format_format, $._primary_expression],
  // Purpose: when FORMAT is followed by identifier-like text, keep it inside format_phrase.
  // Example: PUT x FORMAT decF.
  // Reference: FORMAT option in format-phrase.
  [$.__format_format, $._identifier_or_qualified_name],
  // Purpose: avoid treating FORMAT target as a function call start (`fmt(`) in ambiguous contexts.
  // Example: SET p FORMAT fmt(x).
  // Reference: format-phrase disambiguation.
  [$.__format_format, $.function_call],
];
