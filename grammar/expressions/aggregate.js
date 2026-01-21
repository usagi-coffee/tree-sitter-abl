module.exports = ({ kw, tkw }) => ({
  aggregate_phrase: ($) => seq("(", repeat1($.aggregate_item), ")"),

  aggregate_item: ($) =>
    seq(
      field("operation", $.aggregate_operation),
      optional(alias($.__aggregate_label_clause, $.label_clause)),
      repeat(alias($.__aggregate_by_clause, $.by_clause)),
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

  __aggregate_label_clause: ($) =>
    seq(kw("LABEL"), field("label", $.string_literal)),

  __aggregate_by_clause: ($) => seq(kw("BY"), field("group", $._expression)),
});
