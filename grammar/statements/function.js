module.exports = ({ kw, tkw }) => ({
  function_definition: ($) =>
    seq(
      kw("FUNCTION"),
      field("name", $.identifier),
      choice(kw("RETURNS"), kw("RETURN")),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional($.function_parameter_list),
      optional(alias($.__function_in_phrase, $.in_phrase)),
      choice($._terminator, $._colon),
      repeat($._statement),
      tkw("END"),
      optional(tkw("FUNCTION")),
      $._terminator,
    ),

  function_forward_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("FUNCTION"),
      field("name", $.identifier),
      choice(kw("RETURNS"), kw("RETURN")),
      optional(kw("CLASS")),
      field("type", $._type_name),
      optional($.function_parameter_list),
      optional(alias($.__function_in_phrase, $.in_phrase)),
      $._terminator,
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
