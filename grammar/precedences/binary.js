// References: EXPORT statement; MESSAGE statement; DISPLAY statement; Format phrase; SIZE phrase;
// SYSTEM-DIALOG GET-FILE statement; CASE statement; Frame phrase; AT phrase.
// Purpose: allow full binary expressions inside statement/phrase expression slots.
// Example: EXPORT a - b.
module.exports = ($) => [
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
    $.__format_colon_to,
    $.__format_label,
    $.__format_labels,
    $.__format_labels_tail,
    $.__format_expression,
    $.__format_at_phrase,
    $.__format_editor_options,
    $.conditional_expression,
    $.__put_screen_color_phrase,
    $.__form_radio_button,
    $.__frame_display_option,
    $.__frame_head_item,
    $.size_phrase,
    $.__system_dialog_filters_pairs,
    $.__system_dialog_filter_pair,
    $.__at_column_row,
    $.__at_x_y,
  ],
];
