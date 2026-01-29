module.exports = ({ kw, tkw }) => ({
  insert_statement: ($) => seq(tkw("INSERT"), $.__insert_body, $._terminator),
  __insert_body: ($) =>
    seq(
      field("record", choice($.identifier, $.qualified_name)),
      optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
      optional(seq(kw("USING"), field("using", $._expression))),
      optional(alias($.__insert_frame_phrase, $.frame_phrase)),
      optional(tkw("NO-ERROR")),
    ),
  __insert_frame_phrase: ($) =>
    seq(
      kw("WITH"),
      repeat(
        choice(
          seq(kw("FRAME"), field("frame", $.identifier)),
          seq($.number_literal, tkw("COLUMN")),
          seq($.number_literal, tkw("COLUMNS")),
          tkw("CENTERED"),
          seq(optional($.number_literal), tkw("DOWN")),
          seq(kw("TITLE"), $._expression),
          seq(kw("WIDTH"), $.number_literal),
          tkw("SIDE-LABELS"),
          tkw("NO-LABELS"),
          tkw("NO-BOX"),
          seq(kw("ROW"), $._expression),
          seq(kw("COLUMN"), $._expression),
        ),
      ),
    ),
});
