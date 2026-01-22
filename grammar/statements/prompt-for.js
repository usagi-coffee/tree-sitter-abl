module.exports = ({ kw, tkw }) => ({
  prompt_for_statement: ($) =>
    seq(
      tkw("PROMPT-FOR"),
      optional(alias($.__prompt_for_stream_clause, $.stream_clause)),
      optional(tkw("UNLESS-HIDDEN")),
      repeat1(alias($.__prompt_for_item, $.prompt_for_item)),
      optional(alias($.__prompt_for_go_on, $.go_on_clause)),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      optional(alias($.__prompt_for_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __prompt_for_stream_clause: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
  __prompt_for_item: ($) =>
    prec.right(
      seq(
        field("field", $._expression),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
    ),
  __prompt_for_go_on: ($) =>
    seq(kw("GO-ON"), "(", repeat1($.identifier), ")"),
  __prompt_for_frame_phrase: ($) =>
    seq(kw("WITH"), optional(seq(kw("FRAME"), field("frame", $.identifier)))),
});
