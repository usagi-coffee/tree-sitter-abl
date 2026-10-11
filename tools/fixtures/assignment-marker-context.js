export default grammar({
  precedences: ($) => [[$.__object_access_handle_type, $._bare_marker_identifier]],
  rules: {
    _bare_marker_identifier: ($) =>
      choice(alias($._kw_buffer, $.identifier), alias($._kw_table_handle, $.identifier)),
    __assignment_statement_body: ($) =>
      seq(
        field("left", $._assignable),
        field("operator", $.assignment_operator),
        field("right", choice($._assignment_value, $._bare_marker_identifier)),
        optional($.widget_phrase),
      ),
    _object_access_plain_left: ($) =>
      choice($._qualified_identifier, $._bare_marker_identifier, $.system_handle_identifier),
  },
});
