module.exports = ({ kw, tkw }) => ({
  query_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(
        choice(
          alias($.__query_shared_scope, $.shared_variable_scope),
          seq(
            optional(alias($.__query_access_modifier, $.access_modifier)),
            optional(alias($.__query_static_modifier, $.static_modifier)),
          ),
        ),
      ),
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
      optional(tkw("SCROLLING")),
      optional(tkw("RCODE-INFORMATION")),
    ),

  query_table_list: ($) =>
    seq($.__query_table_entry, repeat(seq(",", $.__query_table_entry))),

  __query_table_entry: ($) =>
    seq(
      field("table", $.__query_table_name),
      repeat(alias($.__query_field_list, $.field_list)),
    ),
  __query_field_list: ($) =>
    seq(
      choice(kw("FIELDS"), kw("EXCEPT")),
      "(",
      optional(seq(
        $.__query_field_name,
        repeat(choice(seq(",", $.__query_field_name), $.__query_field_name)),
      )),
      ")",
    ),
  __query_shared_scope: ($) =>
    choice(seq(kw("NEW"), kw("SHARED")), kw("SHARED")),
  __query_access_modifier: ($) => choice(kw("PRIVATE"), kw("PROTECTED")),
  __query_static_modifier: ($) => kw("STATIC"),
  __query_table_name: ($) => choice($.identifier, $.qualified_name),
  __query_field_name: ($) => choice($.identifier, $.qualified_name),
});
