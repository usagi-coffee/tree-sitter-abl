export default ({ kw }) => ({
  temp_table_definition: ($) => seq($.__temp_table_definition_body, $._terminator),
  __temp_table_definition_body: ($) => seq($.__temp_table_prefix, optional($._temp_table_items)),

  __temp_table_prefix: ($) =>
    seq($._define_keyword, optional($.__temp_table_modifier), kw("TEMP-TABLE"), $._table_body),
  // Aliases for shared rules that reference temp-table specific rules
  _like_phrase: ($) => $.__temp_table_like_phrase,
  _table_field: ($) => $.__temp_table_field,
  _table_index: ($) => $.__temp_table_index,

  __temp_table_field: ($) =>
    seq(
      kw("FIELDS", { alias: "FIELD", offset: 5 }),
      field("name", $.identifier),
      choice(
        $._as_type_name_phrase,
        $.__temp_table_like_type_clause,
        seq($.__temp_table_extent_option, $.__temp_table_like_type_clause),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat($.__temp_table_field_option),
    ),

  __temp_table_index: ($) =>
    seq(
      kw("INDEX"),
      field("name", $.identifier),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      optional(seq(choice($._as_keyword, kw("IS")), repeat($.__temp_table_index_modifier))),
      $.__temp_table_index_fields,
    ),

  __temp_table_index_modifier: ($) =>
    choice(
      alias(kw("UNIQUE"), $.unique),
      alias(kw("PRIMARY"), $.primary),
      alias(kw("WORD-INDEX"), $.word_index),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __temp_table_like_phrase: ($) => seq($._like_keyword, $.__temp_table_like_body),
  __temp_table_like_sequential_phrase: ($) => seq(kw("LIKE-SEQUENTIAL"), $.__temp_table_like_body),
  __temp_table_like_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("like", $.__temp_table_like_name),
      optional(alias(kw("VALIDATE"), $.validate)),
      optional($.__temp_table_use_index_phrases),
    ),
  __temp_table_use_index_phrases: ($) =>
    prec.right(seq($.__temp_table_use_index_phrase, optional($.__temp_table_use_index_phrases))),
  __temp_table_like_type_clause: ($) =>
    seq(
      $._like_keyword,
      field("type", $.__temp_table_like_name),
      optional(alias(kw("VALIDATE"), $.validate)),
    ),
  __temp_table_use_index_phrase: ($) =>
    seq(
      kw("USE-INDEX"),
      field("index", choice($.identifier, $._unquoted_name_initial)),
      optional(alias($.__temp_table_as_primary_phrase, $.as_primary_phrase)),
    ),
  __temp_table_as_primary_phrase: ($) => seq($._as_keyword, alias(kw("PRIMARY"), $.primary)),
  __temp_table_before_table_phrase: ($) => seq(kw("BEFORE-TABLE"), field("before", $.identifier)),
  __temp_table_index_field: ($) =>
    seq(
      field("field", $._identifier_or_qualified_name),
      optional(
        field(
          "sort_order",
          choice(kw("DESCENDING", { offset: 4 }), kw("ASCENDING", { offset: 3 })),
        ),
      ),
    ),
  __temp_table_index_fields: ($) =>
    prec.right(seq($.__temp_table_index_field, optional($.__temp_table_index_fields))),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __temp_table_field_option: ($) =>
    choice(
      $._color_font_option,
      seq(kw("COLUMN-LABEL"), field("column_label", $.__temp_table_label_list)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("DECIMALS"), field("decimals", $.number_literal)),
      $.__temp_table_extent_option,
      $._format_string,
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._help_keyword, field("help", $.string_literal)),
      $._initial_phrase,
      seq(kw("LABEL"), field("label", $.__temp_table_label_list)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("MOUSE-POINTER"), field("mouse_pointer", $._expression)),
      // oxlint-disable-next-line tree-sitter-optimize/keyword-reuse
      seq(optional(alias(kw("NOT"), $.not)), alias(kw("CASE-SENSITIVE"), $.case_sensitive)),
      alias(kw("SERIALIZE-HIDDEN"), $.serialize_hidden),
      $.__temp_table_serialize_name_phrase,
      seq(kw("TTCODEPAGE"), field("ttcodepage", $.string_literal)),
      seq(kw("COLUMN-CODEPAGE"), field("column_codepage", $.string_literal)),
      seq(kw("XML-DATA-TYPE"), field("xml_data_type", $.string_literal)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("XML-NODE-TYPE"), field("xml_node_type", $.string_literal)),
      seq(kw("XML-NODE-NAME"), field("xml_node_name", $.string_literal)),
      $.view_as_phrase,
    ),
  __temp_table_extent_option: ($) =>
    seq(kw("EXTENT"), field("extent", choice($.number_literal, $.preprocessor_name))),
  // oxlint-disable-next-line tree-sitter-optimize/shared-choice
  __temp_table_like_name: ($) => choice($._identifier_or_qualified_name, $.array_access),
  __temp_table_label_list: ($) =>
    seq($.string_literal, optional(seq(",", $.__temp_table_label_list))),
  __temp_table_serialize_name_phrase: ($) =>
    seq(kw("SERIALIZE-NAME"), field("serialize_name", $.string_literal)),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __temp_table_modifier: ($) =>
    choice(
      seq(
        alias($._new_keyword, $.new_modifier),
        optional(alias(kw("GLOBAL"), $.scope_modifier)),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        alias(kw("STATIC"), $.static_modifier),
        optional(
          choice(
            alias(kw("PRIVATE"), $.access_modifier),
            alias(kw("PROTECTED"), $.access_modifier),
          ),
        ),
        optional($._serialization_modifier),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        choice(alias(kw("PRIVATE"), $.access_modifier), alias(kw("PROTECTED"), $.access_modifier)),
        optional(alias(kw("STATIC"), $.static_modifier)),
        optional($._serialization_modifier),
      ),
      $._serialization_modifier,
    ),
});
