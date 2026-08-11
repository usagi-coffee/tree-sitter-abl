// References: DEFINE BROWSE statement.
export default ($) => [
  // Purpose: prefer function call when ENABLE list item is followed by '('.
  // Example: DEFINE BROWSE b QUERY q DISPLAY rec EXCEPT f ENABLE myFunc().
  [$.function_call, $.__browse_enable_field],
  // Purpose: read a subscripted ENABLE item as a browse field rather than as an
  // array access expression opening the item.
  // Example: DEFINE BROWSE b QUERY q DISPLAY rec ENABLE fld[1].
  // Reference: DEFINE BROWSE statement; array reference.
  [$.__browse_enable_field, $.__array_access_prefix],
];
