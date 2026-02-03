// References: DISPLAY statement.
module.exports = ($) => [
  // Purpose: prefer record parsing over plain expressions.
  // Example: DISPLAY Customer EXCEPT Customer.Comments WITH FRAME f2.
  [$.__display_record, $._primary_expression],
  // Purpose: prefer record parsing over identifier/qualified name.
  // Example: DISPLAY Customer WITH BROWSE b.
  [$.__display_record, $._identifier_or_qualified_name],
  // Purpose: prefer browse form when WITH BROWSE is present.
  // Example: DISPLAY Customer EXCEPT Customer.Comments WITH BROWSE b1.
  [$.__display_browse_body, $.__frame_identifier],
  // Purpose: treat fields as fields, not function calls.
  // Example: DISPLAY Customer.Name.
  [$.__display_field, $.function_call],
  // Purpose: SKIP/SPACE should win over function-call/expr parsing.
  // Example: DISPLAY SPACE(2) Customer.Name SKIP(1) Customer.City.
  [$.__display_skip_phrase, $.function_call],
  [$.__display_space_phrase, $.function_call],
  [$.__display_skip_phrase, $._primary_expression],
  [$.__display_space_phrase, $._primary_expression],
  // Purpose: prefer field interpretation over record.
  // Example: DISPLAY Customer.Name IN WINDOW hWin WITH FRAME f1.
  [$.__display_field, $.__display_record],
  // Purpose: prefer item SKIP over frame SKIP.
  // Example: DISPLAY out-param LABEL "Updated YTD Sales" SKIP new-param.
  [$.__display_skip_phrase, $.__frame_skip_phrase],
  // Purpose: prefer WITH frame phrase over treating WITH as a field identifier.
  // Example: DISPLAY menu WITH TITLE "...".
  [$.frame_phrase, $.__display_field],
  [$.frame_phrase, $.__display_items],
  [$.frame_phrase, $.identifier],
  // Purpose: treat MENU as identifier in display fields, not widget keyword.
  // Example: DISPLAY menu.
  [$.__display_keyword_identifier, $._widgets],
];
