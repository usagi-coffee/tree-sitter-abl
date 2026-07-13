export default ({ kw }) => ({
  buffer_definition: ($) => prec.right(seq($.__buffer_prefix, $._terminator)),

  __buffer_prefix: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($._buffer_query_modifier),
      kw("BUFFER"),
      $.__buffer_body,
    ),

  __buffer_body: ($) =>
    seq(
      field("name", $.identifier),
      kw("FOR"),
      optional(field("for", kw("TEMP-TABLE"))),
      field("table", $._identifier_or_qualified_name),
      repeat(
        choice(
          alias(kw("PRESELECT"), $.preselect),
          seq(kw("LABEL"), field("label", $._identifier_or_string_literal)),
          seq(kw("NAMESPACE-URI"), field("namespace_uri", $.string_literal)),
          seq(kw("NAMESPACE-PREFIX"), field("namespace_prefix", $.string_literal)),
          seq(kw("XML-NODE-NAME"), field("node", $.string_literal)),
          seq(kw("SERIALIZE-NAME"), field("serialize_name", $.string_literal)),
        ),
      ),
    ),
});
