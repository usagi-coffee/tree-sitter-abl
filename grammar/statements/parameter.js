export default ({ kw }) => ({
  parameter_definition: ($) => seq($.__parameter_prefix, $._terminator),

  __parameter_prefix: ($) =>
    seq(
      $._define_keyword,
      choice(
        seq(field("direction", kw("RETURN")), $._kw_parameter, $.__parameter_standard_body),
        seq(
          field("direction", $._parameter_direction),
          $._kw_parameter,
          choice(
            $.__parameter_standard_body,
            seq(
              $._kw_table,
              $._for_keyword,
              field("table", $._identifier_or_qualified_name),
              optional($.__parameter_table_options),
            ),
            seq($._table_handle_value, optional($.__parameter_handle_options)),
            seq(
              $._dataset_keyword,
              $._for_keyword,
              field("dataset", $._identifier_or_qualified_name),
              optional($.__parameter_table_options),
            ),
            seq(
              // oxlint-disable-next-line tree-sitter-optimize/shared-valued-fragment
              $._kw_dataset_handle,
              field("dataset_handle", $.identifier),
              optional($.__parameter_handle_options),
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
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __parameter_option: ($) =>
    choice(
      alias(seq(optional(kw("NOT")), kw("CASE-SENSITIVE")), $.case_sensitive),
      $._format_string,
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("COLUMN-LABEL"), field("column_label", $.string_literal)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("DECIMALS"), field("decimals", $.number_literal)),
      alias($._extent_phrase, $.extent_phrase),
      $._initial_phrase,
      seq($._aggregate_label_phrase, optional($.__parameter_label_tail)),
      alias($._no_undo_keyword, $.no_undo),
    ),
  __parameter_table_options: ($) =>
    prec.right(
      seq(
        choice(
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          alias(kw("APPEND"), $.append),
          alias(kw("BIND"), $.bind),
          alias(kw("BY-VALUE"), $.by_value),
          alias($._no_undo_keyword, $.no_undo),
        ),
        optional($.__parameter_table_options),
      ),
    ),
  __parameter_handle_options: ($) =>
    prec.right(
      seq(
        choice(
          alias(kw("BIND"), $.bind),
          alias(kw("BY-VALUE"), $.by_value),
          alias(kw("BY-REFERENCE"), $.by_reference),
          alias($._no_undo_keyword, $.no_undo),
        ),
        optional($.__parameter_handle_options),
      ),
    ),
  __parameter_label_tail: ($) =>
    seq(",", field("label", $.string_literal), optional($.__parameter_label_tail)),

  __parameter_buffer_parameter: ($) =>
    seq(
      $._kw_parameter,
      $._kw_buffer,
      field("name", $.identifier),
      $._for_keyword,
      optional(field("for", kw("TEMP-TABLE"))),
      field("table", $._identifier_or_qualified_name),
      optional(alias(kw("PRESELECT"), $.preselect)),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-optional-sequence
  __parameter_variable_type_phrase: ($) =>
    seq($._as_like, optional(seq($._to_keyword, field("target", $.identifier)))),
});
