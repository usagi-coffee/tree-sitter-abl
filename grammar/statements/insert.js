export default ({ kw }) => ({
  insert_statement: ($) => seq($.__insert_prefix, $._no_error_terminator),
  __insert_prefix: ($) =>
    seq(
      kw("INSERT"),
      field("record", $._identifier_or_qualified_name),
      optional($._except_fields),
      optional($.__insert_after_except),
    ),
  __insert_after_except: ($) =>
    choice(
      seq($._using_keyword, field("using", $._expression), optional($.frame_phrase)),
      $.frame_phrase,
    ),
});
