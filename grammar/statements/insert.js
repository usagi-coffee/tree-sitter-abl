module.exports = ({ kw, tkw }) => ({
  insert_statement: ($) => seq(tkw("INSERT"), $.__insert_body, $._terminator),
  __insert_body: ($) =>
    seq(
      field("record", choice($.identifier, $.qualified_name)),
      optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
      optional(seq(kw("USING"), field("using", $._expression))),
      optional($.frame_phrase),
      optional(tkw("NO-ERROR")),
    ),
});
