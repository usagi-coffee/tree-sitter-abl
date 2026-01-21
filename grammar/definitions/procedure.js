module.exports = ({ kw, tkw }) => ({
  procedure_definition: ($) =>
    seq(
      kw("PROCEDURE"),
      field("name", $.identifier),
      $._colon,
      repeat($._statement),
      tkw("END"),
      optional(token(/PROCEDURE/i)),
      $._terminator,
    ),

  procedure_forward_definition: ($) =>
    seq(kw("PROCEDURE"), field("name", $.identifier), $._terminator),

  parameter_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      choice(
        $.__procedure_standard_parameter,
        $.__procedure_table_parameter,
        $.__procedure_buffer_parameter,
      ),
      $._terminator,
    ),

  __procedure_standard_parameter: ($) =>
    seq(
      choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"), kw("RETURN")),
      token(/PARAM(ETER)?/i),
      field("name", $.identifier),
      $.__procedure_variable_type_clause,
      optional(alias($.__procedure_initial_option, $.initial_option)),
      optional(alias($.__procedure_no_undo, $.no_undo)),
    ),

  __procedure_table_parameter: ($) =>
    seq(
      choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT")),
      token(/PARAM(ETER)?/i),
      choice(
        seq(
          kw("TABLE"),
          kw("FOR"),
          field("table", $.__procedure_record_name),
          repeat($.__procedure_table_parameter_option),
        ),
        seq(
          kw("TABLE-HANDLE"),
          field("table_handle", $.identifier),
          repeat($.__procedure_handle_parameter_option),
        ),
        seq(
          kw("DATASET"),
          kw("FOR"),
          field("dataset", $.__procedure_record_name),
          repeat($.__procedure_table_parameter_option),
        ),
        seq(
          kw("DATASET-HANDLE"),
          field("dataset_handle", $.identifier),
          repeat($.__procedure_handle_parameter_option),
        ),
      ),
    ),

  __procedure_buffer_parameter: ($) =>
    seq(
      kw("PARAMETER"),
      kw("BUFFER"),
      field("name", $.identifier),
      kw("FOR"),
      optional(kw("TEMP-TABLE")),
      field("table", $.__procedure_record_name),
      optional(token(/PRESELECT/i)),
    ),

  __procedure_variable_type_clause: ($) =>
    seq(
      choice(
        seq(
          kw("AS"),
          optional(kw("CLASS")),
          field("type", $._type_or_string),
        ),
        seq(kw("LIKE"), field("like", $.__procedure_field_name)),
      ),
      optional($.__procedure_extent_clause),
    ),

  __procedure_extent_clause: ($) =>
    seq(kw("EXTENT"), optional($.__procedure_extent_size)),

  __procedure_initial_option: ($) =>
    seq(
      kw("INITIAL"),
      choice($._expression, seq("[", optional($._expression_list), "]")),
    ),

  __procedure_no_undo: ($) => token(/NO-UNDO/i),
  __procedure_extent_size: ($) =>
    choice($.number_literal, $.constant, $.identifier),
  __procedure_field_name: ($) => choice($.qualified_name, $.identifier),
  __procedure_record_name: ($) => choice($.qualified_name, $.identifier),
  __procedure_table_parameter_option: ($) =>
    choice(token(/APPEND/i), token(/BIND/i), token(/BY-VALUE/i)),
  __procedure_handle_parameter_option: ($) =>
    choice(token(/BIND/i), token(/BY-VALUE/i)),
});
