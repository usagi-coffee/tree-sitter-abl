module.exports = ({ kw }) => ({
  dataset_reference: ($) =>
    seq(
      kw("DATASET"),
      field("dataset", choice($.object_access, $.qualified_name, $.identifier)),
    ),
});
