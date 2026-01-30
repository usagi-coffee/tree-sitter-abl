module.exports = ({ tkw }) => ({
  accum_expression: ($) => seq(tkw("ACCUM"), $.__accum_expression_body),
  __accum_expression_body: ($) =>
    seq(
      field("operation", repeat1($.aggregate_phrase)),
      field("field", $._expression),
    ),
});
