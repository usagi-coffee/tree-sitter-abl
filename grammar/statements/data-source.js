const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  data_source_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("DATA-SOURCE"),
      $.__data_source_body,
      $._terminator,
    ),

  // For classes - with modifiers
  data_source_class_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      ...definitionModifiers($, kw, {
        access: ["PRIVATE", "PROTECTED"],
        static: true,
      }),
      kw("DATA-SOURCE"),
      $.__data_source_body,
      $._terminator,
    ),

  __data_source_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(seq(kw("QUERY"), field("query", $.identifier))),
      optional(
        seq(
          kw("FOR"),
          $.__data_source_buffer_phrase,
          repeat(seq(",", $.__data_source_buffer_phrase)),
        ),
      ),
    ),

  __data_source_buffer_phrase: ($) =>
    seq(
      field("buffer", $.__data_source_buffer_name),
      optional(
        seq(
          kw("KEYS"),
          "(",
          choice(
            kw("ROWID"),
            seq(
              field("field", $.__data_source_field_name),
              repeat(seq(",", field("field", $.__data_source_field_name))),
            ),
          ),
          ")",
        ),
      ),
    ),

  __data_source_buffer_name: ($) => choice($.identifier, $.qualified_name),
  __data_source_field_name: ($) => choice($.identifier, $.qualified_name),
});
