// References: EXPORT statement.
// Purpose: ensure terminator binds to the statement, not the item.
// Example: EXPORT a;
export default ($) => [[$.export_statement, $.__export_expression]];
