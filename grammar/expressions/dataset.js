export default ({ kw }) => ({
  dataset_reference: ($) =>
    seq(
      $._dataset_keyword,
      field("dataset", choice($.object_access, $._identifier_or_qualified_name)),
      optional($.arguments),
    ),
});
