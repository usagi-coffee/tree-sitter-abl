export default ({ kw }) => ({
  parameter_definition: ($) => seq($.__parameter_prefix, $._terminator),

  __parameter_prefix: ($) =>
    seq(
      $._define_keyword,
      choice(
        seq(
          field("direction", kw("RETURN")),
          kw("PARAMETER", { offset: 5 }),
          $.__parameter_standard_body,
        ),
        seq(
          field("direction", $._parameter_direction),
          kw("PARAMETER", { offset: 5 }),
          choice(
            $.__parameter_standard_body,
            seq(
              kw("TABLE"),
              $._for_keyword,
              field("table", $._identifier_or_qualified_name),
              optional($.__parameter_table_options),
            ),
            seq(
              kw("TABLE-HANDLE"),
              field("table_handle", $.identifier),
              repeat(
                choice(
                  alias(kw("BIND"), $.bind),
                  alias(kw("BY-VALUE"), $.by_value),
                  alias(kw("BY-REFERENCE"), $.by_reference),
                  alias($._no_undo_keyword, $.no_undo),
                ),
              ),
            ),
            seq(
              $._dataset_keyword,
              $._for_keyword,
              field("dataset", $._identifier_or_qualified_name),
              optional($.__parameter_table_options),
            ),
            seq(
              kw("DATASET-HANDLE"),
              field("dataset_handle", $.identifier),
              repeat(
                choice(
                  alias(kw("BIND"), $.bind),
                  alias(kw("BY-VALUE"), $.by_value),
                  alias(kw("BY-REFERENCE"), $.by_reference),
                  alias($._no_undo_keyword, $.no_undo),
                ),
              ),
            ),
          ),
        ),
        $.__parameter_buffer_parameter,
      ),
    ),

  __parameter_standard_body: ($) =>
    seq(
      field("name", $.identifier),
      $.__parameter_variable_type_phrase,
      optional($.__parameter_options),
    ),
  __parameter_options: ($) =>
    prec.right(seq($.__parameter_option, optional($.__parameter_options))),
  __parameter_option: ($) =>
    choice(
      alias(seq(optional(kw("NOT")), kw("CASE-SENSITIVE")), $.case_sensitive),
      $._format_string,
      seq(kw("COLUMN-LABEL"), field("column_label", $.string_literal)),
      seq(kw("DECIMALS"), field("decimals", $.number_literal)),
      alias($._extent_phrase, $.extent_phrase),
      seq(kw("INITIAL", { offset: 4 }), field("initial", $._initial_value)),
      seq(kw("LABEL"), field("label", $.string_literal), optional($.__parameter_label_tail)),
      alias($._no_undo_keyword, $.no_undo),
    ),
  __parameter_table_options: ($) =>
    prec.right(seq($.__parameter_table_option, optional($.__parameter_table_options))),
  __parameter_table_option: ($) =>
    choice(
      alias(kw("APPEND"), $.append),
      alias(kw("BIND"), $.bind),
      alias(kw("BY-VALUE"), $.by_value),
      alias($._no_undo_keyword, $.no_undo),
    ),
  __parameter_label_tail: ($) =>
    seq(",", field("label", $.string_literal), optional($.__parameter_label_tail)),

  __parameter_buffer_parameter: ($) =>
    seq(
      kw("PARAMETER", { offset: 5 }),
      kw("BUFFER"),
      field("name", $.identifier),
      $._for_keyword,
      optional(field("for", kw("TEMP-TABLE"))),
      field("table", $._identifier_or_qualified_name),
      optional(alias(kw("PRESELECT"), $.preselect)),
    ),

  __parameter_variable_type_phrase: ($) =>
    seq($._as_like, optional(seq($._to_keyword, field("target", $.identifier)))),
});
