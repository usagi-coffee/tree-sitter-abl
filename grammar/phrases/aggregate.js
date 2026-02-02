module.exports = ({ kw }) => ({
  aggregate_phrase: ($) =>
    seq(
      field("operation", $.aggregate_operation),
      optional(alias($.__aggregate_label_phrase, $.label_phrase)),
      repeat(alias($.__aggregate_by_phrase, $.by_phrase)),
    ),

  aggregate_operation: ($) =>
    choice(
      kw("AVERAGE"),
      kw("COUNT"),
      kw("MAXIMUM"),
      kw("MINIMUM"),
      kw("TOTAL"),
      kw("SUB-AVERAGE"),
      kw("SUB-COUNT"),
      kw("SUB-MAXIMUM"),
      kw("SUB-MINIMUM"),
      kw("SUB-TOTAL"),
    ),

  __aggregate_label_phrase: ($) =>
    seq(kw("LABEL"), field("label", $.string_literal)),

  __aggregate_by_phrase: ($) =>
    seq(kw("BY"), field("group", choice($.identifier, $.qualified_name))),
});
