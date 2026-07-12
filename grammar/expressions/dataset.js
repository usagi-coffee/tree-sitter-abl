module.exports = ({ kw }) => ({
  dataset_reference: ($) =>
    seq(
      $.__dataset_expression_prefix,
      field("dataset", choice($.object_access, $._identifier_or_qualified_name)),
    ),
  __dataset_expression_prefix: ($) => kw("DATASET"),
});
