module.exports = ({ kw, tkw }) => ({
  set_statement: ($) =>
    seq(
      tkw("SET"),
      optional(alias($.__set_stream_phrase, $.stream_phrase)),
      optional(tkw("UNLESS-HIDDEN")),
      repeat1(alias($.__set_item, $.set_item)),
      optional(alias($.__set_go_on, $.go_on_phrase)),
      optional(alias($.__set_frame_phrase, $.frame_phrase)),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
  __set_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
  __set_item: ($) =>
    prec.right(
      seq(
        field("field", $._expression),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
    ),
  __set_go_on: ($) => seq(tkw("GO-ON"), "(", repeat1($.identifier), ")"),
  __set_frame_phrase: ($) =>
    seq(kw("WITH"), optional(seq(kw("FRAME"), field("frame", $.identifier)))),
});
