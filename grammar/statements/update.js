export default ({ kw }) => ({
  update_statement: ($) => seq($.__update_prefix, $._no_error_terminator),

  __update_prefix: ($) => seq(kw("UPDATE"), choice($.__update_record_body, $.__update_fields_body)),

  __update_record_body: ($) =>
    seq(field("record", $.__update_record), optional($._except_fields), optional($.frame_phrase)),

  __update_fields_body: ($) =>
    seq(
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      $.__update_fields,
      optional(alias($._go_on_phrase, $.go_on_phrase)),
      optional($._frame_phrases),
      optional($.editing_phrase),
    ),

  __update_record: ($) => $._identifier_or_qualified_name,
  __update_field: ($) =>
    choice(
      alias($._skip_phrase, $.skip_phrase),
      alias($._space_phrase, $.space_phrase),
      seq($.__update_field_target_item, optional($._when_phrase)),
      seq($.__update_field_target_item, "=", field("value", $._expression)),
      seq(kw("TEXT"), "(", $._text_fields, ")"),
      seq(
        field("constant", $.string_literal),
        optional(
          seq(choice($._at_keyword, $._to_keyword), field("position", token(/[0-9]+(\.[0-9]+)?/))),
        ),
      ),
      "^",
    ),
  __update_fields: ($) =>
    prec.right(seq(alias($.__update_field, $.field), optional($.__update_fields))),

  __update_field_target_item: ($) =>
    seq(field("field", $.__update_field_target), optional($.format_phrase)),
  __update_field_target: ($) => choice($._identifier_or_qualified_name, $.array_access),
});
