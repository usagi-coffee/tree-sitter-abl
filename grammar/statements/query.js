const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  query_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      ...definitionModifiers($, kw, {
        access: ["PRIVATE", "PROTECTED"],
        new: true,
        scope: ["SHARED"],
        static: true,
      }),
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
      repeat(alias($.__query_field_list, $.field_list)),
    ),
  __query_field_list: ($) =>
    seq(
      choice(kw("FIELDS"), kw("EXCEPT")),
      "(",
      optional(
        seq(
          $.__query_field_name,
          repeat(choice(seq(",", $.__query_field_name), $.__query_field_name)),
        ),
      ),
      ")",
    ),
  __query_table_name: ($) => $._identifier_or_qualified_name,
  __query_field_name: ($) => $._identifier_or_qualified_name,
});
