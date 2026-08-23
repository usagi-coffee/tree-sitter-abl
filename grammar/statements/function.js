export default ({ kw }) => ({
  function_definition: ($) => seq($.__function_prefix, $._terminator),

  __function_prefix: ($) =>
    seq(
      kw("FUNCTION"),
      field("name", $._routine_name),
      optional(kw("RETURNS", { offset: 5 })),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional(alias($._extent_phrase, $.extent_phrase)),
      optional($.__function_access_parameters_tail),
      $.__function_compound_body,
    ),
  __function_access_parameters_tail: ($) =>
    choice(
      seq(
        choice(
          alias(kw("PRIVATE"), $.access_modifier),
          alias(kw("PROTECTED"), $.access_modifier),
          alias(kw("PUBLIC"), $.access_modifier),
        ),
        optional(alias($.__function_definition_parameters, $.parameters)),
      ),
      alias($.__function_definition_parameters, $.parameters),
    ),
  __function_compound_body: ($) =>
    seq(
      choice(alias($._colon, ":"), $._terminator),
      repeat($._statement),
      $._end_keyword,
      optional(kw("FUNCTION")),
    ),

  function_forward_definition: ($) => seq($.__function_forward_definition_prefix, $._terminator),

  __function_forward_definition_prefix: ($) =>
    choice(
      seq(
        $._define_keyword,
        kw("FUNCTION"),
        seq($.__function_forward_head, optional($.__function_forward_target)),
      ),
      seq(kw("FUNCTION"), seq($.__function_forward_head, $.__function_forward_target)),
    ),

  __function_forward_head: ($) =>
    seq(
      field("name", $._routine_name),
      optional(kw("RETURNS", { offset: 5 })),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional(alias($._extent_phrase, $.extent_phrase)),
      optional(
        choice(
          alias(kw("PRIVATE"), $.access_modifier),
          alias(kw("PROTECTED"), $.access_modifier),
          alias(kw("PUBLIC"), $.access_modifier),
        ),
      ),
      optional(alias($.__function_parameters, $.parameters)),
    ),

  __function_forward_target: ($) =>
    choice(
      seq(
        optional(alias($.__function_map_phrase, $.map_phrase)),
        alias($.__function_in_phrase, $.in_phrase),
      ),
      alias(kw("FORWARDS", { alias: "FORWARD", offset: 7 }), $.forward),
    ),

  __function_parameters: ($) => seq("(", optional($.__function_parameter_list), ")"),
  __function_parameter_list: ($) =>
    seq(
      alias($.__function_parameter, $.parameter),
      repeat(seq(",", alias($.__function_parameter, $.parameter))),
    ),
  __function_definition_parameters: ($) =>
    seq(
      "(",
      optional(
        seq(
          alias($.__function_definition_parameter, $.parameter),
          repeat(seq(",", alias($.__function_definition_parameter, $.parameter))),
        ),
      ),
      ")",
    ),
  __function_parameter: ($) =>
    seq(
      optional(field("direction", $._parameter_direction)),
      choice(
        $.__function_named_parameter_body,
        seq(optional(kw("CLASS")), field("type", $._type_name), optional($._extent_phrase)),
      ),
    ),
  __function_definition_parameter: ($) =>
    seq(optional(field("direction", $._parameter_direction)), $.__function_named_parameter_body),
  __function_named_parameter_body: ($) =>
    choice(
      seq(
        field("name", $.identifier),
        $.__function_variable_type_phrase,
        optional(alias(kw("NO-UNDO"), $.no_undo)),
      ),
      seq(
        kw("BUFFER"),
        field("buffer", $.identifier),
        $._for_keyword,
        field("table", $._identifier_or_qualified_name),
      ),
      seq(
        kw("TABLE"),
        optional($._for_keyword),
        field("table", $._identifier_or_qualified_name),
        optional($.__function_table_options),
      ),
      seq(
        kw("TABLE-HANDLE"),
        field("table_handle", $.identifier),
        optional($.__function_table_options),
      ),
      seq(
        kw("DATASET"),
        $._for_keyword,
        field("dataset", $._identifier_or_qualified_name),
        optional($.__function_table_options),
      ),
      seq(
        kw("DATASET-HANDLE"),
        field("dataset_handle", $.identifier),
        optional($.__function_table_options),
      ),
    ),

  __function_table_options: ($) =>
    choice(
      seq(
        alias(kw("APPEND"), $.append),
        optional(alias(kw("BIND"), $.bind)),
        optional(alias(kw("BY-VALUE"), $.by_value)),
      ),
      seq(alias(kw("BIND"), $.bind), optional(alias(kw("BY-VALUE"), $.by_value))),
      alias(kw("BY-VALUE"), $.by_value),
    ),

  __function_variable_type_phrase: ($) => seq($._as_like, optional($._extent_phrase)),

  __function_map_phrase: ($) => seq(kw("MAP"), $._to_keyword, field("actual", $.identifier)),
  __function_in_phrase: ($) => seq($._in_keyword, field("context", $._expression)),
});
