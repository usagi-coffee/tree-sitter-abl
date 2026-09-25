export default ({ kw }) => ({
  buffer_definition: ($) => prec.right(seq($.__buffer_prefix, $._terminator)),

  __buffer_prefix: ($) =>
    seq($._define_keyword, optional($._buffer_query_modifier), $._kw_buffer, $.__buffer_body),

  __buffer_body: ($) =>
    seq(
      field("name", $.identifier),
      $._kw_for,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(field("for", kw("TEMP-TABLE"))),
      field("table", $._qualified_identifier),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat(
        choice(
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          alias(kw("PRESELECT"), $.preselect),
          seq($._kw_label, field("label", $._identifier_or_string_literal)),
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq(kw("NAMESPACE-URI"), field("namespace_uri", $.string_literal)),
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq(kw("NAMESPACE-PREFIX"), field("namespace_prefix", $.string_literal)),
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
          seq(kw("XML-NODE-NAME"), field("node", $.string_literal)),
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
          seq(kw("SERIALIZE-NAME"), field("serialize_name", $.string_literal)),
        ),
      ),
    ),
});
