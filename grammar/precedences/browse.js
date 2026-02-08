// References: DEFINE BROWSE statement.
module.exports = ($) => [
  // Purpose: prefer function call when ENABLE list item is followed by '('.
  // Example: DEFINE BROWSE b QUERY q DISPLAY rec EXCEPT f ENABLE myFunc().
  [$.function_call, $.__browse_enable_field],
];
