// References: ENABLE statement.
// Purpose: allow full expressions inside enable items.
// Example: ENABLE a - b.
module.exports = ($) => [[$.__enable_item, $._primary_expression]];
