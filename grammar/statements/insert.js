module.exports = ({ kw }) => ({
  insert_statement: ($) => seq(kw("INSERT"), $.__insert_body, $._terminator),
  __insert_body: ($) =>
    seq(
      field("record", $._identifier_or_qualified_name),
      optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
      optional(seq(kw("USING"), field("using", $._expression))),
      optional($.frame_phrase),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),
});
