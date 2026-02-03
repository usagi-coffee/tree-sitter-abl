// References: Widget phrase; ON statement.
module.exports = ($) => [
  // Purpose: treat widget entries as widgets, not generic expressions.
  // Example: ON CHOOSE OF btn foo - bar.
  [$.__widget_entry, $._primary_expression],
  // Purpose: prefer function calls only when explicitly called.
  // Example: ON CHOOSE OF btn foo().
  [$.function_call, $.__widget_entry],
  // Purpose: prefer bare handles over field/column entries.
  // Example: ON CHOOSE OF btnFind DO:
  [$.__widget_handle, $.__widget_entry],
  // Purpose: prefer widget-qualified name when IN <widget> follows object access.
  // Example: MENU-ITEM m1:SENSITIVE IN MENU mymenu = TRUE.
  [$.widget_qualified_name, $.object_access],
  // Purpose: prefer widget-qualified name when IN <widget> follows identifier.
  // Example: x IN FRAME f.
  [$.widget_qualified_name, $._primary_expression],
];
