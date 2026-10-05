export default grammar({
  name: "fixture",
  rules: {
    _class_type: ($) => seq(optional($._kw_class), field("type", $._type_or_string)),
    _as_like: ($) =>
      choice(seq($._kw_as, $._class_type), seq($._kw_like, field("like", $._qualified_identifier))),
    _format_field_option: ($) =>
      choice(
        $._as_like,
        seq($._kw_bgcolor, field("bgcolor", $.__format_expression)),
        seq($._kw_fgcolor, field("fgcolor", $.__format_expression)),
        seq($._kw_font, field("font", $.__format_expression)),
      ),
    __parameter_variable_type_phrase: ($) =>
      seq($._as_like, optional(seq($._kw_to, field("target", $.identifier)))),
    __function_variable_type_phrase: ($) => seq($._as_like, optional($._extent_phrase)),
  },
});
