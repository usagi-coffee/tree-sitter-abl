module.exports = ({ kw }) => ({
  function_definition: ($) => seq($.__function_prefix, $._terminator),

  __function_prefix: ($) => seq(kw("FUNCTION"), $.__function_body),

  __function_body: ($) =>
    seq(
      field("name", $.identifier),
      kw("RETURNS", { offset: 5 }),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional(
        choice(
          alias(kw("PRIVATE"), $.access_modifier),
          alias(kw("PROTECTED"), $.access_modifier),
          alias(kw("PUBLIC"), $.access_modifier),
        ),
      ),
      optional(alias($.__function_parameters, $.parameters)),
      $.__function_compound_body,
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
      seq(kw("DEFINE", { offset: 3 }), kw("FUNCTION"), $.__function_forward_body),
      seq(kw("FUNCTION"), $.__function_forward_required_body),
    ),

  __function_forward_body: ($) =>
    seq($.__function_forward_head, optional($.__function_forward_target)),

  __function_forward_required_body: ($) =>
    seq($.__function_forward_head, $.__function_forward_target),

  __function_forward_head: ($) =>
    seq(
      field("name", $.identifier),
      kw("RETURNS", { offset: 5 }),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional(alias($.__function_parameters, $.parameters)),
    ),

  __function_forward_target: ($) =>
    choice(
      seq(
        optional(alias($.__function_map_phrase, $.map_phrase)),
        alias($.__function_in_phrase, $.in_phrase),
      ),
      alias(kw("FORWARD"), $.forward),
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
      optional(field("direction", choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT")))),
      field("name", $.identifier),
      $.__function_variable_type_phrase,
      optional(alias(kw("NO-UNDO"), $.no_undo)),
    ),

  __function_variable_type_phrase: ($) => seq($._as_like, optional($._extent_phrase)),

  __function_map_phrase: ($) => seq(kw("MAP"), kw("TO"), field("actual", $.identifier)),
  __function_in_phrase: ($) => seq(kw("IN"), field("context", $._expression)),
});
