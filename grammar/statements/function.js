module.exports = ({ kw, tkw }) => ({
  function_definition: ($) =>
    seq(kw("FUNCTION"), $.__function_body, $._terminator),
  __function_body: ($) =>
    seq(
      field("name", $.identifier),
      choice(kw("RETURNS"), kw("RETURN")),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional($.function_parameter_list),
      choice($._terminator, $._colon),
      repeat($._statement),
      tkw("END"),
      optional(tkw("FUNCTION")),
    ),

  function_forward_definition: ($) =>
    choice(
      seq(
        choice(kw("DEFINE"), kw("DEF")),
        kw("FUNCTION"),
        $.__function_forward_body_1,
        $._terminator,
      ),
      seq(kw("FUNCTION"), $.__function_forward_body_2, $._terminator),
    ),

  __function_forward_body_1: ($) =>
    seq(
      field("name", $.identifier),
      choice(kw("RETURNS"), kw("RETURN")),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional($.function_parameter_list),
      optional($.__function_forward_option),
    ),

  __function_forward_body_2: ($) =>
    seq(
      field("name", $.identifier),
      choice(kw("RETURNS"), kw("RETURN")),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional($.function_parameter_list),
      $.__function_forward_option,
    ),

  function_parameter_list: ($) =>
    seq(
      "(",
      optional(
        seq($.function_parameter, repeat(seq(",", $.function_parameter))),
      ),
      ")",
    ),

  function_parameter: ($) =>
    seq(
      optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
      field("name", $.identifier),
      $.__function_variable_type_phrase,
      optional(alias($.__function_no_undo, $.no_undo)),
    ),

  __function_variable_type_phrase: ($) =>
    seq(
      choice(
        seq(kw("AS"), optional(kw("CLASS")), field("type", $._type_or_string)),
        seq(kw("LIKE"), field("like", $.__function_field_name)),
      ),
      optional($.__function_extent_phrase),
    ),

  __function_extent_phrase: ($) =>
    seq(tkw("EXTENT"), optional($.__function_extent_size)),
  __function_in_phrase: ($) => seq(kw("IN"), field("context", $._expression)),
  __function_forward_phrase: ($) => tkw("FORWARD"),
  __function_forward_option: ($) =>
    choice(
      alias($.__function_in_phrase, $.in_phrase),
      alias($.__function_forward_phrase, $.forward_phrase),
    ),
  __function_no_undo: ($) => tkw("NO-UNDO"),
  __function_extent_size: ($) =>
    choice(
      $.number_literal,
      alias($.constant_expression, $.constant),
      $.identifier,
      $.null_literal,
    ),
  __function_field_name: ($) => choice($.qualified_name, $.identifier),
});
