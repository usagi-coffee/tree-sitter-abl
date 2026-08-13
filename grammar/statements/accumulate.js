export default ({ kw }) => ({
  accumulate_statement: ($) => seq($.__accumulate_prefix, $._terminator),

  __accumulate_prefix: ($) =>
    seq(kw("ACCUMULATE"), repeat1(alias($.__accumulate_item, $.accumulate))),

  __accumulate_item: ($) =>
    seq(field("target", $._expression), "(", repeat1($.aggregate_phrase), ")"),
});
