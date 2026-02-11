module.exports = ({ kw }) => ({
  query_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__query_modifier),
      kw("QUERY"),
      $.__query_body,
      $._terminator,
    ),

  __query_body: ($) =>
    seq(
      field("name", $.identifier),
      kw("FOR"),
      $.query_table_list,
      optional(alias($.__query_cache_phrase, $.cache_phrase)),
      optional(alias(kw("SCROLLING"), $.scrolling)),
      optional(alias(kw("RCODE-INFORMATION"), $.rcode_information)),
    ),
  __query_cache_phrase: ($) =>
    seq(kw("CACHE"), field("cache", $.number_literal)),

  query_table_list: ($) =>
    seq($.__query_table_entry, repeat(seq(",", $.__query_table_entry))),

  __query_table_entry: ($) =>
    seq(
      field("table", $._identifier_or_qualified_name),
      optional(alias($.__query_field_list, $.field_list)),
    ),
  __query_field_list: ($) =>
    choice(
      seq(
        $.__query_fields_list,
        optional($.__query_except_list),
      ),
      $.__query_except_list,
    ),
  __query_fields_list: ($) =>
    seq(
      kw("FIELDS"),
      "(",
      optional($.__query_field_names),
      ")",
    ),
  __query_except_list: ($) =>
    seq(
      kw("EXCEPT"),
      "(",
      optional($.__query_field_names),
      ")",
    ),
  __query_field_names: ($) =>
    seq(
      $._identifier_or_qualified_name,
      repeat(seq(optional(","), $._identifier_or_qualified_name)),
    ),
  __query_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("STATIC"), $.static_modifier),
      seq(
        alias(kw("PRIVATE"), $.access_modifier),
        alias(kw("STATIC"), $.static_modifier),
      ),
      seq(
        alias(kw("PROTECTED"), $.access_modifier),
        alias(kw("STATIC"), $.static_modifier),
      ),
      seq(
        alias(kw("STATIC"), $.static_modifier),
        alias(kw("PRIVATE"), $.access_modifier),
      ),
      seq(
        alias(kw("STATIC"), $.static_modifier),
        alias(kw("PROTECTED"), $.access_modifier),
      ),
    ),
});
