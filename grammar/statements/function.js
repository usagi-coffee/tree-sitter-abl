export default ({ kw }) => ({
  function_definition: ($) => seq($.__function_prefix, $._terminator),

  __function_prefix: ($) =>
    seq(
      kw("FUNCTION"),
      field("name", $.identifier),
      kw("RETURNS", { offset: 5 }),
      optional(kw("CLASS")),
      field("type", $._type_name),
      // A function returns an array as readily as it declares one, and the
      // prototype already says so.
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
        optional(alias($.__function_parameters, $.parameters)),
      ),
      alias($.__function_parameters, $.parameters),
    ),
  __function_compound_body: ($) =>
    seq(
      choice(alias($._colon, ":"), $._terminator),
      repeat($._statement),
      kw("END"),
      optional(kw("FUNCTION")),
    ),

  function_forward_definition: ($) => seq($.__function_forward_definition_prefix, $._terminator),

  __function_forward_definition_prefix: ($) =>
    choice(
      seq(
        kw("DEFINE", { offset: 3 }),
        kw("FUNCTION"),
        seq($.__function_forward_head, optional($.__function_forward_target)),
      ),
      seq(kw("FUNCTION"), seq($.__function_forward_head, $.__function_forward_target)),
    ),

  // The syntax box reads `[ RETURNS ] return-type`, and the return type takes
  // an extent like any other: `FUNCTION f RETURNS CHARACTER EXTENT (p AS
  // CHARACTER) FORWARD.` returns an array.
  __function_forward_head: ($) =>
    seq(
      field("name", $.identifier),
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

  __function_parameters: ($) =>
    seq(
      "(",
      optional(
        seq(
          alias($.__function_parameter, $.parameter),
          repeat(seq(",", alias($.__function_parameter, $.parameter))),
        ),
      ),
      ")",
    ),

  __function_parameter: ($) =>
    seq(
      optional(field("direction", $._parameter_direction)),
      choice(
        seq(
          field("name", $.identifier),
          $.__function_variable_type_phrase,
          optional(alias(kw("NO-UNDO"), $.no_undo)),
        ),
        seq(
          kw("BUFFER"),
          field("buffer", $.identifier),
          kw("FOR"),
          field("table", $._identifier_or_qualified_name),
        ),
        // The syntax box spells it `TABLE FOR name [APPEND] [BIND] [BY-VALUE]`,
        // like the DEFINE PARAMETER statement. FOR stays optional because a
        // test already pins the shorter form.
        seq(
          kw("TABLE"),
          optional(kw("FOR")),
          field("table", $._identifier_or_qualified_name),
          repeat($.__function_table_option),
        ),
        seq(
          kw("TABLE-HANDLE"),
          field("table_handle", $.identifier),
          repeat($.__function_table_option),
        ),
        seq(
          kw("DATASET"),
          kw("FOR"),
          field("dataset", $._identifier_or_qualified_name),
          repeat($.__function_table_option),
        ),
        seq(
          kw("DATASET-HANDLE"),
          field("dataset_handle", $.identifier),
          repeat($.__function_table_option),
        ),
        // A prototype states only the mode and data type of each parameter, so the
        // name may be absent. Definition and prototype share every token up to the
        // closing parenthesis, so one rule has to serve both.
        seq(optional(kw("CLASS")), field("type", $._type_name), optional($._extent_phrase)),
      ),
    ),

  __function_table_option: ($) =>
    choice(
      alias(kw("APPEND"), $.append),
      alias(kw("BIND"), $.bind),
      alias(kw("BY-VALUE"), $.by_value),
    ),

  __function_variable_type_phrase: ($) => seq($._as_like, optional($._extent_phrase)),

  __function_map_phrase: ($) => seq(kw("MAP"), kw("TO"), field("actual", $.identifier)),
  __function_in_phrase: ($) => seq(kw("IN"), field("context", $._expression)),
});
