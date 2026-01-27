module.exports = ({ tkw }) => ({
  accum_expression: ($) =>
    seq(
      tkw("ACCUM"),
      field("operation", $.aggregate_operation),
      field("field", $._expression),
    ),
});
