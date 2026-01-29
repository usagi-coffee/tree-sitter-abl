module.exports = ({ kw }) => ({
  accumulate_statement: ($) => seq(kw("ACCUMULATE"), $._terminator),

  __accumulate_body: ($) =>
    seq(
      alias($.__accumulate_item, $.accumulate_item),
      repeat(alias($.__accumulate_item, $.accumulate_item)),
    ),

  __accumulate_item: ($) =>
    seq(field("value", $._expression), field("aggregate", $.aggregate_phrase)),
});
