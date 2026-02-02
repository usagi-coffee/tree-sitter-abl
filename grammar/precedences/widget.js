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
  // Purpose: treat IN FRAME as widget qualifier here, not expression.
  // Example: ON CHOOSE OF btn foo IN FRAME f.
  [$.__widget_entry, $._in_frame_target],
];
