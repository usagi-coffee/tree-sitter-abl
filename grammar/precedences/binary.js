// References: EXPORT statement; MESSAGE statement; DISPLAY statement; Format phrase; SIZE phrase;
// SYSTEM-DIALOG GET-FILE statement; CASE statement; Frame phrase; Color/font options; AT phrase.
// Purpose: allow full binary expressions inside statement/phrase expression slots.
// Example: EXPORT a - b.
module.exports = ($) => [
  // Purpose: continue an existing expression with the extracted additive operator.
  // Example: PUT SCREEN ROW iRow + 1 COLUMN iCol + 2 "Text".
  // Reference: expression operator precedence.
  [$.__additive_operator, $.unary_expression],
  [
    $.binary_expression,
    $.__message_expression,
    $.__export_expression,
    $.__os_create_dir_directory,
    $.__os_delete_target,
    $.__underline_field,
    $.__call_argument,
    $.__put_control,
    $.__accum_expression,
    $.__frame_expression,
    $.__at_phrase_body,
    $.__display_when_expression,
    $._format_colon_to,
    $._format_label,
    $._format_labels,
    $._format_labels_tail,
    $.__format_expression,
    $.__format_at_phrase,
    $.__format_at_column,
    $.__format_at_row,
    $.__format_at_x,
    $.__format_at_y,
    $.__format_editor_options,
    $.conditional_expression,
    $.__put_screen_color_phrase,
    $.__form_radio_button,
    $.__frame_display_option,
    $._color_font_option,
    $.__frame_head_item,
    $._size_phrase,
    $.__system_dialog_filters_pairs,
    $.__system_dialog_filter_pair,
    $.__at_column_row,
    $.__at_of_suffix,
    $.__at_x_y,
  ],
];
