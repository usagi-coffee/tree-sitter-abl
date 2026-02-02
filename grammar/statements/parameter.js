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
          alias($.__parameter_case_sensitive, $.case_sensitive),
          alias($.__parameter_format, $.format),
          alias($.__parameter_column_label, $.column_label),
          alias($.__parameter_decimals, $.decimals),
          alias($.__parameter_initial_option, $.initial_option),
          alias($.__parameter_label_option, $.label_option),
          alias($.__parameter_no_undo, $.no_undo),
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
          field("table", $.__parameter_record_name),
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
          field("dataset", $.__parameter_record_name),
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
      field("table", $.__parameter_record_name),
      optional(kw("PRESELECT")),
    ),

  __parameter_variable_type_phrase: ($) =>
    seq(
      choice(
        seq(
          kw("AS"),
          optional(kw("CLASS")),
          field("type", $._type_or_string),
          optional(seq(kw("TO"), $.identifier)),
        ),
        seq(kw("LIKE"), field("like", $.__parameter_field_name)),
      ),
      optional(alias($.__parameter_extent_phrase, $.extent_phrase)),
    ),

  __parameter_extent_phrase: ($) =>
    seq(kw("EXTENT"), optional($.__parameter_extent_size)),

  __parameter_initial_option: ($) =>
    seq(
      kw("INITIAL"),
      choice($._expression, seq("[", optional($._expressions), "]")),
    ),

  __parameter_no_undo: ($) => kw("NO-UNDO"),
  __parameter_case_sensitive: ($) =>
    seq(optional(kw("NOT")), kw("CASE-SENSITIVE")),
  __parameter_column_label: ($) => seq(kw("COLUMN-LABEL"), $.string_literal),
  __parameter_decimals: ($) => seq(kw("DECIMALS"), $.number_literal),
  __parameter_format: ($) => seq(kw("FORMAT"), $.string_literal),
  __parameter_label_option: ($) =>
    seq(kw("LABEL"), $.string_literal, repeat(seq(",", $.string_literal))),
  __parameter_extent_size: ($) =>
    choice(
      $.number_literal,
      alias($.constant_expression, $.constant),
      $.identifier,
      $.null_literal,
    ),
  __parameter_field_name: ($) => choice($.qualified_name, $.identifier),
  __parameter_record_name: ($) => choice($.qualified_name, $.identifier),
  __parameter_table_parameter_option: ($) =>
    choice(
      alias($.__parameter_append_option, $.append_option),
      alias($.__parameter_bind_option, $.bind_option),
      alias($.__parameter_by_value_option, $.by_value_option),
      alias($.__parameter_no_undo, $.no_undo),
    ),
  __parameter_append_option: ($) => kw("APPEND"),
  __parameter_handle_parameter_option: ($) =>
    choice(
      alias($.__parameter_bind_option, $.bind_option),
      alias($.__parameter_by_value_option, $.by_value_option),
      alias($.__parameter_by_reference_option, $.by_reference_option),
      alias($.__parameter_no_undo, $.no_undo),
    ),
  __parameter_bind_option: ($) => kw("BIND"),
  __parameter_by_value_option: ($) => kw("BY-VALUE"),
  __parameter_by_reference_option: ($) => kw("BY-REFERENCE"),
});
