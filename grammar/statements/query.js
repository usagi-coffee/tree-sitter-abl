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
      optional(seq(kw("CACHE"), field("cache", $.number_literal))),
      optional(kw("SCROLLING")),
      optional(kw("RCODE-INFORMATION")),
    ),

  query_table_list: ($) =>
    seq($.__query_table_entry, repeat(seq(",", $.__query_table_entry))),

  __query_table_entry: ($) =>
    seq(
      field("table", $.__query_table_name),
      optional(alias($.__query_field_list, $.field_list)),
    ),
  __query_field_list: ($) =>
    seq(
      choice(kw("FIELDS"), kw("EXCEPT")),
      "(",
      optional($.__query_field_names),
      ")",
    ),
  __query_field_names: ($) =>
    seq($.__query_field_name, repeat(seq(optional(","), $.__query_field_name))),
  __query_table_name: ($) => $._identifier_or_qualified_name,
  __query_field_name: ($) => $._identifier_or_qualified_name,
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
