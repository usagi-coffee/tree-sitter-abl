// References: DEFINE BROWSE statement.
module.exports = ($) => [
  // Purpose: prefer browse column name over generic identifier/qualified name.
  // Example: DEFINE BROWSE b QUERY q DISPLAY myCol().
  [$.__browse_column_name, $._identifier_or_qualified_name],
  // Purpose: prefer function call when column name is followed by '('.
  // Example: DEFINE BROWSE b QUERY q DISPLAY obj:Fn().
  [$.function_call, $.__browse_column_name],
  // Purpose: prefer function call when ENABLE list item is followed by '('.
  // Example: DEFINE BROWSE b QUERY q DISPLAY rec EXCEPT f ENABLE myFunc().
  [$.function_call, $.__browse_enable_field],
];
