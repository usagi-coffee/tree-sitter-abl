module.exports = ({ kw, tkw }) => ({
  update_statement: ($) =>
    seq(
      tkw("UPDATE"),
      optional(tkw("UNLESS-HIDDEN")),
      repeat1(alias($.__update_item, $.update_item)),
      optional(alias($.__update_go_on, $.go_on_phrase)),
      optional(alias($.__update_frame_phrase, $.frame_phrase)),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
  __update_item: ($) =>
    prec.right(
      seq(
        field("field", $._expression),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
    ),
  __update_go_on: ($) => seq(tkw("GO-ON"), "(", repeat1($.identifier), ")"),
  __update_frame_phrase: ($) =>
    seq(kw("WITH"), optional(seq(kw("FRAME"), field("frame", $.identifier)))),
});
