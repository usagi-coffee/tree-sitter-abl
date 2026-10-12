export default ({ kw }) => ({
  __function_named_parameter_body: ($) =>
    choice(
      seq(
        field("name", $.identifier),
        $.__function_variable_type_phrase,
        optional(alias($._kw_no_undo, $.no_undo)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/shared-valued-fragment
        $._kw_buffer,
        // oxlint-disable-next-line tree-sitter-optimize/shared-field-marker
        field("buffer", $.identifier),
        $._kw_for,
        field("table", $._qualified_identifier),
      ),
      seq(
        $._kw_table,
        optional($._kw_for),
        field("table", $._qualified_identifier),
        optional($.__function_table_options),
      ),
      seq($._table_handle_value, optional($.__function_table_options)),
      seq(
        $._kw_dataset,
        $._kw_for,
        field("dataset", $._qualified_identifier),
        optional($.__function_table_options),
      ),
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/shared-valued-fragment
        $._kw_dataset_handle,
        field("dataset_handle", $.identifier),
        optional($.__function_table_options),
      ),
    ),

  __function_table_options: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("APPEND"), $.append)),
      choice(
        seq(alias(kw("BIND"), $.bind), optional(alias(kw("BY-VALUE"), $.by_value))),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        alias(kw("BY-VALUE"), $.by_value),
      ),
    ),
});
