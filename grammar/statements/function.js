export default ({ kw }) => ({
  __function_signature: ($) =>
    seq(field("name", $._routine_name), optional(kw("RETURNS", { offset: 5 })), $.__function_type),
  function_definition: ($) => seq($.__function_prefix, $._terminator),

  __function_prefix: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("FUNCTION"),
      $.__function_signature,
      optional($.__function_extent_phrase),
      $.__function_prefix_tail,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence, tree-sitter-optimize/single-use-alias-sequence
  __function_prefix_tail: ($) =>
    seq(
      optional($._routine_access_modifier),
      optional(alias($.__function_definition_parameters, $.parameters)),
      $.__function_compound_body,
    ),
  __function_compound_body: ($) =>
    seq(
      choice(alias($._colon, ":"), $._terminator),
      $._compound_body,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(kw("FUNCTION")),
    ),

  function_forward_definition: ($) => seq($.__function_forward_definition_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __function_forward_definition_prefix: ($) =>
    choice(
      seq(
        $._kw_define,
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        kw("FUNCTION"),
        seq($.__function_forward_head, optional($.__function_forward_target)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      seq(kw("FUNCTION"), seq($.__function_forward_head, $.__function_forward_target)),
    ),

  __function_forward_head: ($) => seq($.__function_signature, optional($.__function_forward_tail)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __function_forward_tail: ($) =>
    choice(
      seq(
        optional($.__function_extent_phrase),
        optional($._routine_access_modifier),
        alias($.__function_parameters, $.parameters),
      ),
      seq(optional($.__function_extent_phrase), $._routine_access_modifier),
      $.__function_extent_phrase,
    ),

  __function_extent_phrase: ($) => alias($._extent_phrase, $.extent_phrase),
  __function_type: ($) => seq(optional($._kw_class), field("type", $._type_name)),

  __function_forward_target: ($) =>
    choice(
      seq(
        optional(alias($.__function_map_phrase, $.map_phrase)),
        alias($.__function_in_phrase, $.in_phrase),
      ),
      alias($._kw_forwards, $.forward),
    ),
  __function_parameters: ($) => seq("(", optional($.__function_parameter_list), ")"),
  __function_parameter_list: ($) =>
    seq(
      alias($.__function_parameter, $.parameter),
      optional(seq(",", $.__function_parameter_list)),
    ),
  __function_definition_parameters: ($) =>
    seq("(", optional($.__function_definition_parameter_head), ")"),
  __function_definition_parameter_head: ($) =>
    seq(
      alias($.__function_definition_parameter, $.parameter),
      optional(seq(",", $.__function_definition_parameter_head)),
    ),
  __function_parameter: ($) =>
    seq(
      optional(field("direction", $._parameter_direction)),
      choice($.__function_named_parameter_body, seq($.__function_type, optional($._extent_phrase))),
    ),
  __function_definition_parameter: ($) =>
    seq(optional(field("direction", $._parameter_direction)), $.__function_named_parameter_body),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
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
        $._dataset_keyword,
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

  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __function_variable_type_phrase: ($) => seq($._as_like, optional($._extent_phrase)),

  __function_map_phrase: ($) => seq($._kw_map, $._kw_to, field("actual", $.identifier)),
  __function_in_phrase: ($) => seq($._kw_in, field("context", $._expression)),
});
