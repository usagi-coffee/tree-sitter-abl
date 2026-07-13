// References: CASE statement.
// Purpose: treat OR WHEN as list separators, not logical operators.
// Example: CASE x: WHEN a OR WHEN b THEN ...
export default ($) => [[$.__case_when_expression_list_tail, $.binary_expression]];
