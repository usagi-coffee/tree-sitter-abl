module.exports = ({ kw, tkw }) => ({
  aggregate_phrase: ($) =>
    seq(
      field("operation", $.aggregate_operation),
      optional(alias($.__aggregate_label_phrase, $.label_phrase)),
      repeat(alias($.__aggregate_by_phrase, $.by_phrase)),
    ),

  aggregate_operation: ($) =>
    choice(
      tkw("AVERAGE"),
      tkw("COUNT"),
      tkw("MAXIMUM"),
      tkw("MINIMUM"),
      tkw("TOTAL"),
      tkw("SUB-AVERAGE"),
      tkw("SUB-COUNT"),
      tkw("SUB-MAXIMUM"),
      tkw("SUB-MINIMUM"),
      tkw("SUB-TOTAL"),
    ),

  __aggregate_label_phrase: ($) =>
    seq(kw("LABEL"), field("label", $.string_literal)),

  __aggregate_by_phrase: ($) => seq(kw("BY"), field("group", $._expression)),
});
