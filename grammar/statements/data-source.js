export default ({ kw }) => ({
  data_source_definition: ($) => seq($.__data_source_prefix, $._terminator),

  __data_source_prefix: ($) => seq($._define_keyword, kw("DATA-SOURCE"), $.__data_source_body),

  // For classes - with modifiers
  data_source_class_definition: ($) =>
    seq(
      $._define_keyword,
      optional($.__data_source_modifier),
      kw("DATA-SOURCE"),
      $.__data_source_body,
      $._terminator,
    ),

  __data_source_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(seq(kw("QUERY"), field("query", $.identifier))),
      optional(
        seq($._for_keyword, $.__data_source_buffer_phrase, optional($.__data_source_buffer_tail)),
      ),
    ),
  __data_source_buffer_tail: ($) =>
    seq(",", $.__data_source_buffer_phrase, optional($.__data_source_buffer_tail)),

  __data_source_buffer_phrase: ($) =>
    seq(
      field("buffer", $._identifier_or_qualified_name),
      optional(
        seq(
          kw("KEYS"),
          "(",
          choice(
            kw("ROWID"),
            seq(
              field("field", $._identifier_or_qualified_name),
              optional($.__data_source_key_field_tail),
            ),
          ),
          ")",
        ),
      ),
    ),
  __data_source_key_field_tail: ($) =>
    seq(
      ",",
      field("field", $._identifier_or_qualified_name),
      optional($.__data_source_key_field_tail),
    ),
  __data_source_modifier: ($) =>
    choice(
      seq($.__data_source_access_modifier, optional($.__data_source_static)),
      $.__data_source_static,
      seq($.__data_source_static, $.__data_source_access_modifier),
    ),
  __data_source_access_modifier: ($) =>
    choice(alias(kw("PRIVATE"), $.access_modifier), alias(kw("PROTECTED"), $.access_modifier)),
  __data_source_static: ($) => alias(kw("STATIC"), $.static_modifier),
});
