// References: EXPORT statement.
// Purpose: ensure terminator binds to the statement, not the item.
// Example: EXPORT a;
module.exports = ($) => [[$.export_statement, $.__export_expression]];
