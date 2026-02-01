module.exports = ({ kw }) => ({
  accum_expression: ($) => seq(kw("ACCUM"), $.__accum_expression_body),
  __accum_expression_body: ($) =>
    seq(
      field("operation", repeat1($.aggregate_phrase)),
      field("field", $._expression),
    ),
});
