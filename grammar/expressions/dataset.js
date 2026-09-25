export default ({ kw }) => ({
  dataset_reference: ($) =>
    seq(
      $._kw_dataset,
      field("dataset", choice($.object_access, $._qualified_identifier)),
      optional($.arguments),
    ),
});
