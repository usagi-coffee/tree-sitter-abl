module.exports = ({ kw }) => ({
  query_definition: ($) => seq($.__query_prefix, $._terminator),

  __query_prefix: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($._buffer_query_modifier),
      kw("QUERY"),
      $.__query_body,
    ),

  __query_body: ($) =>
    seq(field("name", $.identifier), kw("FOR"), $.query_table_list, optional($.__query_tail)),
  __query_tail: ($) =>
    choice(
      seq(alias($.__query_cache_phrase, $.cache_phrase), optional($.__query_scrolling_rcode_tail)),
      $.__query_scrolling_rcode_tail,
    ),
  __query_scrolling_rcode_tail: ($) =>
    choice(
      seq(
        alias(kw("SCROLLING"), $.scrolling),
        optional(alias(kw("RCODE-INFORMATION"), $.rcode_information)),
      ),
      alias(kw("RCODE-INFORMATION"), $.rcode_information),
    ),
  __query_cache_phrase: ($) => seq(kw("CACHE"), field("cache", $.number_literal)),

  query_table_list: ($) => seq($.__query_table_entry, repeat(seq(",", $.__query_table_entry))),

  __query_table_entry: ($) =>
    seq(
      field("table", $._identifier_or_qualified_name),
      optional(alias($.__query_field_list, $.field_list)),
    ),
  __query_field_list: ($) =>
    choice(seq($.__query_fields_list, optional($.__query_except_list)), $.__query_except_list),
  __query_fields_list: ($) => seq(kw("FIELDS"), $.__query_parenthesized_field_names),
  __query_except_list: ($) => seq(kw("EXCEPT"), $.__query_parenthesized_field_names),
  __query_parenthesized_field_names: ($) => seq("(", optional($.__query_field_names), ")"),
  __query_field_names: ($) =>
    seq(
      $._identifier_or_qualified_name,
      repeat(seq(optional(","), $._identifier_or_qualified_name)),
    ),
});
