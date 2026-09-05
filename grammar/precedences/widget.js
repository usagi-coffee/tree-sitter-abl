// References: Widget phrase; ON statement.
export default ($) => [
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
  [$.__widget_entry, $._expression],
  // Purpose: prefer function calls only when explicitly called.
  // Example: ON CHOOSE OF btn foo().
  // Reference: Widget phrase.
  [$.function_call, $.__widget_entry],
  // Purpose: prefer function calls only when explicitly called, even for bare handle branch.
  // Example: ON CHOOSE OF myFunc().
  // Reference: Widget phrase.
  [$.function_call, $.__widget_handle],
  // Purpose: same as above, for the VIEW/HIDE-only widget-ref variant.
  // Example: VIEW myFunc().
  // Reference: Widget phrase; VIEW statement; HIDE statement.
  [$.function_call, $.__view_hide_widget_ref],
  // Purpose: a name that IN FRAME, IN BROWSE or MENU-ITEM qualifies is an
  // entry; a name on its own can no longer match the entry rule, so reading
  // the entry first keeps the qualifier attached without stealing bare names.
  // Example: HIDE TBADR IN FRAME FR1.
  // Reference: Widget phrase; HIDE statement.
  [$.__widget_entry, $.__widget_handle],
  // Purpose: inside a frame, a widget keyword on its own is the name of a field,
  // not the start of an attribute reference qualified by widget type.
  // Example: DEFINE FRAME F1 Image AT ROW 3.42 COL 1.72.
  // Reference: Frame phrase; DEFINE FRAME statement.
  [$.__frame_form_item, "object_widget_prefix"],
  // Purpose: prefer widget-qualified name when IN <widget> follows object access.
  // Example: MENU-ITEM m1:SENSITIVE IN MENU mymenu = TRUE.
  // Reference: Widget phrase.
  [$.widget_qualified_name, $.object_access],
];
