module.exports = ({ kw }) => ({
  insert_statement: ($) => seq(kw("INSERT"), $.__insert_body, $._no_error_terminator),
  __insert_body: ($) =>
    seq(
      field("record", $._identifier_or_qualified_name),
      optional($.__except_fields),
      optional(seq(kw("USING"), field("using", $._expression))),
      optional($.frame_phrase),
    ),
});
