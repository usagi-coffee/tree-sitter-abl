export default ({ kw }) => ({
  accumulate_statement: ($) => seq($.__accumulate_prefix, $._terminator),

  __accumulate_prefix: ($) => seq(kw("ACCUMULATE"), $.__accumulate_items),

  __accumulate_items: ($) =>
    prec.right(seq(alias($.__accumulate_item, $.accumulate), optional($.__accumulate_items))),

  __accumulate_item: ($) =>
    seq(
      field("target", $._expression),
      "(",
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat1($.aggregate_phrase),
      ")",
    ),
});
