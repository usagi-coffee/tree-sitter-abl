module.exports = ({ kw }) => ({
  accumulate_statement: ($) =>
    seq(
      kw("ACCUMULATE"),
      $.accumulate_item,
      repeat($.accumulate_item),
      $._terminator,
    ),

  accumulate_item: ($) =>
    seq(field("value", $._expression), field("aggregate", $.aggregate_phrase)),
});
