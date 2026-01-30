module.exports = ({ kw, tkw }) => ({
  accumulate_statement: ($) =>
    seq(tkw("ACCUMULATE"), $.__accumulate_body, $._terminator),

  __accumulate_body: ($) =>
    seq(
      alias($.__accumulate_item, $.accumulate),
      repeat(alias($.__accumulate_item, $.accumulate)),
    ),

  __accumulate_item: ($) =>
    seq(field("target", $._expression), "(", repeat1($.aggregate_phrase), ")"),
});
