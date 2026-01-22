module.exports = ({ kw, tkw }) => ({
  disable_statement: ($) =>
    seq(
      tkw("DISABLE"),
      optional(tkw("UNLESS-HIDDEN")),
      choice(
        seq(
          tkw("ALL"),
          optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
        ),
        repeat1(alias($.__disable_field, $.disable_field)),
      ),
      optional(alias($.__disable_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __disable_field: ($) =>
    seq(
      field("field", $._expression),
      optional(seq(kw("WHEN"), field("when", $._expression))),
    ),
  __disable_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
