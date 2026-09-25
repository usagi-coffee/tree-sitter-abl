export default ({ kw }) => ({
  data_source_definition: ($) => seq($.__data_source_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence, tree-sitter-optimize/single-use-sequence
  __data_source_prefix: ($) => seq($._define_keyword, $._kw_data_source, $.__data_source_body),

  // For classes - with modifiers
  data_source_class_definition: ($) =>
    seq(
      $._define_keyword,
      optional($.__data_source_modifier),
      $._kw_data_source,
      $.__data_source_body,
      $._terminator,
    ),

  __data_source_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("name", $.identifier),
      optional($._query_name_phrase),
      optional(
        // oxlint-disable-next-line tree-sitter-optimize/list-head-extraction
        seq($._for_keyword, $.__data_source_buffer_phrase, optional($.__data_source_buffer_tail)),
      ),
    ),
  __data_source_buffer_tail: ($) =>
    seq(",", $.__data_source_buffer_phrase, optional($.__data_source_buffer_tail)),

  __data_source_buffer_phrase: ($) =>
    seq(
      field("buffer", $._identifier_or_qualified_name),
      optional(seq(kw("KEYS"), "(", choice($._kw_rowid, $.__data_source_key_fields), ")")),
    ),
  __data_source_key_fields: ($) =>
    seq(
      field("field", $._identifier_or_qualified_name),
      optional(seq(",", $.__data_source_key_fields)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __data_source_modifier: ($) =>
    choice(
      seq($.__data_source_access_modifier, optional($.__data_source_static)),
      $.__data_source_static,
      seq($.__data_source_static, $.__data_source_access_modifier),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-choice
  __data_source_access_modifier: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
    choice(alias(kw("PRIVATE"), $.access_modifier), alias(kw("PROTECTED"), $.access_modifier)),
  // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
  __data_source_static: ($) => alias(kw("STATIC"), $.static_modifier),
});
