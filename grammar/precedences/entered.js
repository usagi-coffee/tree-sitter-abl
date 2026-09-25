// References: NOT ENTERED function.
// Purpose: continue a field operand into the postfix NOT ENTERED operator.
// Example: IF field NOT ENTERED THEN RETURN.
export default ($) => [[$.entered_expression, $._qualified_identifier]];
