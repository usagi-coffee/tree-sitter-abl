module.exports = ({ op }) => ({
  dataset_reference: ($) =>
    seq(
      op("DATASET"),
      field(
        "dataset",
        choice($.object_access, $.qualified_name, $.identifier),
      ),
    ),
});
