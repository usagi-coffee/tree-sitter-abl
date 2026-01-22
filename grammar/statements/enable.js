module.exports = ({ kw, tkw }) => ({
  enable_statement: ($) =>
    seq(
      tkw("ENABLE"),
      optional(tkw("UNLESS-HIDDEN")),
      choice(
        seq(
          tkw("ALL"),
          optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
        ),
        repeat1(alias($.__enable_field, $.enable_field)),
      ),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      optional(alias($.__enable_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __enable_field: ($) =>
    seq(
      field("field", $._expression),
      optional(seq(kw("WHEN"), field("when", $._expression))),
    ),
  __enable_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
