module.exports = ({ kw }) => ({
  parameter_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      choice(
        $.__parameter_standard_parameter,
        $.__parameter_table_parameter,
        $.__parameter_buffer_parameter,
      ),
      $._terminator,
    ),

  __parameter_standard_parameter: ($) =>
    seq(
      choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"), kw("RETURN")),
      kw("PARAMETER", { offset: 5 }),
      field("name", $.identifier),
      $.__parameter_variable_type_phrase,
      repeat(
        choice(
          alias(seq(optional(kw("NOT")), kw("CASE-SENSITIVE")), $.case_sensitive),
          seq(kw("FORMAT", { offset: 4 }), field("format", $.string_literal)),
          seq(kw("COLUMN-LABEL"), field("column_label", $.string_literal)),
          seq(kw("DECIMALS"), field("decimals", $.number_literal)),
          seq(
            kw("INITIAL"),
            field("initial", choice($._expression, seq("[", optional($._expressions), "]"))),
          ),
          seq(
            kw("LABEL"),
            field("label", $.string_literal),
            repeat(seq(",", field("label", $.string_literal))),
          ),
          alias(kw("NO-UNDO"), $.no_undo),
        ),
      ),
    ),

  __parameter_table_parameter: ($) =>
    seq(
      choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT")),
      kw("PARAMETER", { offset: 5 }),
      choice(
        seq(
          kw("TABLE"),
          kw("FOR"),
          field("table", $._identifier_or_qualified_name),
          repeat($.__parameter_table_parameter_option),
        ),
        seq(
          kw("TABLE-HANDLE"),
          field("table_handle", $.identifier),
          repeat($.__parameter_handle_parameter_option),
        ),
        seq(
          kw("DATASET"),
          kw("FOR"),
          field("dataset", $._identifier_or_qualified_name),
          repeat($.__parameter_table_parameter_option),
        ),
        seq(
          kw("DATASET-HANDLE"),
          field("dataset_handle", $.identifier),
          repeat($.__parameter_handle_parameter_option),
        ),
      ),
    ),

  __parameter_buffer_parameter: ($) =>
    seq(
      kw("PARAMETER", { offset: 5 }),
      kw("BUFFER"),
      field("name", $.identifier),
      kw("FOR"),
      optional(kw("TEMP-TABLE")),
      field("table", $._identifier_or_qualified_name),
      optional(kw("PRESELECT")),
    ),

  __parameter_variable_type_phrase: ($) =>
    seq(
      choice(
        seq(
          kw("AS"),
          optional(kw("CLASS")),
          field("type", $._type_or_string),
          optional(seq(kw("TO"), field("target", $.identifier))),
        ),
        seq(kw("LIKE"), field("like", $._identifier_or_qualified_name)),
      ),
      optional(alias($.__parameter_extent_phrase, $.extent_phrase)),
    ),

  __parameter_extent_phrase: ($) =>
    seq(kw("EXTENT"), optional(field("size", $.__parameter_extent_size))),

  __parameter_extent_size: ($) =>
    choice(
      $.number_literal,
      alias($.constant_expression, $.preprocessor_reference),
      $.identifier,
      $.null_literal,
    ),
  __parameter_table_parameter_option: ($) =>
    choice(
      alias(kw("APPEND"), $.append),
      alias(kw("BIND"), $.bind),
      alias(kw("BY-VALUE"), $.by_value),
      alias(kw("NO-UNDO"), $.no_undo),
    ),
  __parameter_handle_parameter_option: ($) =>
    choice(
      alias(kw("BIND"), $.bind),
      alias(kw("BY-VALUE"), $.by_value),
      alias(kw("BY-REFERENCE"), $.by_reference),
      alias(kw("NO-UNDO"), $.no_undo),
    ),
});
