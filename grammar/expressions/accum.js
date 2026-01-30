module.exports = ({ tkw }) => ({
  accum_expression: ($) =>
    seq(
      tkw("ACCUM"),
      field("operation", repeat1($.aggregate_phrase)),
      field("field", $._expression),
    ),
});
