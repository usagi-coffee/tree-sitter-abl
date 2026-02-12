// References: Widget phrase; ON statement.
module.exports = ($) => [
  // Purpose: disambiguate ON "WEB-NOTIFY" ANYWHERE against generic UI event symbols.
  // Example: ON "WEB-NOTIFY" ANYWHERE DO: END.
  // Reference: ON statement.
  [$.__on_web_notify_event, $._events],
  // Purpose: prefer explicit WEB-NOTIFY ANYWHERE form over generic UI ANYWHERE form.
  // Example: ON "WEB-NOTIFY" ANYWHERE DO: END.
  // Reference: ON statement.
  [$.__on_web_notify_branch, $.__on_ui_anywhere_branch],
  // Purpose: treat widget entries as widgets, not generic expressions.
  // Example: ON CHOOSE OF btn foo - bar.
  // Reference: Widget phrase.
  [$.__widget_entry, $._primary_expression],
  // Purpose: prefer function calls only when explicitly called.
  // Example: ON CHOOSE OF btn foo().
  // Reference: Widget phrase.
  [$.function_call, $.__widget_entry],
  // Purpose: prefer bare handles over field/column entries.
  // Example: ON CHOOSE OF btnFind DO:
  // Reference: Widget phrase.
  [$.__widget_handle, $.__widget_entry],
  // Purpose: prefer widget-qualified name when IN <widget> follows object access.
  // Example: MENU-ITEM m1:SENSITIVE IN MENU mymenu = TRUE.
  // Reference: Widget phrase.
  [$.widget_qualified_name, $.object_access],
  // Purpose: prefer widget-qualified name when IN <widget> follows identifier.
  // Example: x IN FRAME f.
  // Reference: Widget phrase.
  [$.widget_qualified_name, $._primary_expression],
];
