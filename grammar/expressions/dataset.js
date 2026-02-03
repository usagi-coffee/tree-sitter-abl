module.exports = ({ kw }) => ({
  dataset_reference: ($) =>
    seq(
      kw("DATASET"),
      field(
        "dataset",
        choice($.object_access, $._identifier_or_qualified_name),
      ),
    ),
});
