// References: ENABLE statement.
// Purpose: allow full expressions inside enable items.
// Example: ENABLE a - b.
export default ($) => [[$.__enable_item, $._primary_expression]];
