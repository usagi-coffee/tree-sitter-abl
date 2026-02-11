module.exports = ({ kw }) => ({
  function_definition: ($) =>
    seq(kw("FUNCTION"), $.__function_body, $._terminator),

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
      choice(alias($._colon, ":"), $._terminator),
      repeat($._statement),
      kw("END"),
      optional(kw("FUNCTION")),
    ),

  function_forward_definition: ($) =>
    choice(
      seq(
        kw("DEFINE", { offset: 3 }),
        kw("FUNCTION"),
        $.__function_forward_body_1,
        $._terminator,
      ),
      seq(kw("FUNCTION"), $.__function_forward_body_2, $._terminator),
    ),

  __function_forward_body_1: ($) =>
    seq(
      field("name", $.identifier),
      kw("RETURNS", { offset: 5 }),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional(alias($.__function_parameters, $.parameters)),
      optional(
        choice(
          seq(
            optional(alias($.__function_map_phrase, $.map_phrase)),
            alias($.__function_in_phrase, $.in_phrase),
          ),
          alias(kw("FORWARD"), $.forward),
        ),
      ),
    ),

  __function_forward_body_2: ($) =>
    seq(
      field("name", $.identifier),
      kw("RETURNS", { offset: 5 }),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional(alias($.__function_parameters, $.parameters)),
      choice(
        seq(
          optional(alias($.__function_map_phrase, $.map_phrase)),
          alias($.__function_in_phrase, $.in_phrase),
        ),
        alias(kw("FORWARD"), $.forward),
      ),
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

  __function_variable_type_phrase: ($) =>
    seq(
      choice(
        seq(kw("AS"), optional(kw("CLASS")), field("type", $._type_or_string)),
        seq(kw("LIKE"), field("like", $._identifier_or_qualified_name)),
      ),
      optional($.__function_extent_phrase),
    ),

  __function_extent_phrase: ($) =>
    seq(kw("EXTENT"), optional(field("size", $.__function_extent_size))),
  __function_map_phrase: ($) =>
    seq(kw("MAP"), kw("TO"), field("actual", $.identifier)),
  __function_in_phrase: ($) => seq(kw("IN"), field("context", $._expression)),
  __function_extent_size: ($) =>
    choice(
      $.number_literal,
      alias($.constant_expression, $.preprocessor_reference),
      $.identifier,
      $.null_literal,
    ),
});
