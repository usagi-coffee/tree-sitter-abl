module.exports = ({ kw }) => ({
  accumulate_statement: ($) =>
    seq(
      kw("ACCUMULATE"),
      repeat1(alias($.__accumulate_item, $.accumulate)),
      $._terminator,
    ),

  __accumulate_item: ($) =>
    seq(field("target", $._expression), "(", repeat1($.aggregate_phrase), ")"),
});
