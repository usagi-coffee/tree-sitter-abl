export default ({ kw }) => ({
  query_definition: ($) => seq($.__query_prefix, $._terminator),

  __query_prefix: ($) =>
    seq($._kw_define, optional($._buffer_query_modifier), $._kw_query, $.__query_body),

  __query_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("name", $.identifier),
      $._kw_for,
      $.query_table_list,
      optional(alias($.__query_cache_phrase, $.cache_phrase)),
      optional(alias(kw("SCROLLING"), $.scrolling)),
      optional(alias(kw("RCODE-INFORMATION"), $.rcode_information)),
    ),
  __query_cache_phrase: ($) => seq($._kw_cache, field("cache", $.number_literal)),

  query_table_list: ($) => seq($.__query_table_entry, optional($.__query_table_list_tail)),
  __query_table_list_tail: ($) =>
    seq(",", $.__query_table_entry, optional($.__query_table_list_tail)),

  __query_table_entry: ($) =>
    seq(
      field("table", $._qualified_identifier),
      optional(alias($.__query_field_list, $.field_list)),
    ),
  __query_field_list: ($) =>
    choice(seq($.__query_fields_list, optional($.__query_except_list)), $.__query_except_list),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __query_fields_list: ($) => seq(kw("FIELDS", { offset: 5 }), $.__query_field_names_prefix, ")"),
  // oxlint-disable-next-line tree-sitter-optimize/tail-extraction
  __query_except_list: ($) => seq($._kw_except, $.__query_field_names_prefix, ")"),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __query_field_names_prefix: ($) => seq("(", optional($._field_names)),
});
