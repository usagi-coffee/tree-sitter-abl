export default ({ kw }) => ({
  dataset_reference: ($) =>
    seq(
      $._dataset_keyword,
      field("dataset", choice($.object_access, $._qualified_identifier)),
      optional($.arguments),
    ),
});
