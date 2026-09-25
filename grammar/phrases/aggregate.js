export default ({ kw }) => ({
  aggregate_phrase: ($) =>
    prec.right(
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat1(
        // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
        seq(
          field("operation", $.aggregate_operation),
          optional(alias($._aggregate_label_phrase, $.label_phrase)),
          optional($.__aggregate_by_phrases),
        ),
      ),
    ),
  __aggregate_by_phrases: ($) =>
    prec.right(
      seq(alias($.__aggregate_by_phrase, $.by_phrase), optional($.__aggregate_by_phrases)),
    ),

  aggregate_operation: ($) =>
    choice(
      $._kw_average,
      $._kw_count,
      $._kw_maximum,
      $._kw_minimum,
      kw("TOTAL"),
      kw("SUB-AVERAGE"),
      kw("SUB-COUNT"),
      kw("SUB-MAXIMUM"),
      kw("SUB-MINIMUM"),
      kw("SUB-TOTAL"),
    ),

  __aggregate_by_phrase: ($) => seq($._by_keyword, field("group", $._identifier_or_qualified_name)),
});
