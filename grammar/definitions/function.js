module.exports = ({ kw, tkw }) => ({
  function_definition: ($) =>
    seq(
      kw("FUNCTION"),
      field("name", $.identifier),
      choice(kw("RETURNS"), kw("RETURN")),
      field("type", $._type_name),
      optional($.function_parameter_list),
      choice($._terminator, $._colon),
      repeat($._statement),
      tkw("END"),
      optional(token(/FUNCTION/i)),
      $._terminator,
    ),

  function_forward_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("FUNCTION"),
      field("name", $.identifier),
      choice(kw("RETURNS"), kw("RETURN")),
      field("type", $._type_name),
      optional($.function_parameter_list),
      $._terminator,
    ),

  function_parameter_list: ($) =>
    seq(
      "(",
      optional(seq($.function_parameter, repeat(seq(",", $.function_parameter)))),
      ")",
    ),

  function_parameter: ($) =>
    seq(
      optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
      field("name", $.identifier),
      $.__function_variable_type_clause,
      optional(alias($.__function_no_undo, $.no_undo)),
    ),

  __function_variable_type_clause: ($) =>
    seq(
      choice(
        seq(kw("AS"), optional(kw("CLASS")), field("type", $._type_or_string)),
        seq(kw("LIKE"), field("like", $.__function_field_name)),
      ),
      optional($.__function_extent_clause),
    ),

  __function_extent_clause: ($) =>
    seq(kw("EXTENT"), optional($.__function_extent_size)),
  __function_no_undo: ($) => token(/NO-UNDO/i),
  __function_extent_size: ($) =>
    choice($.number_literal, $.constant, $.identifier),
  __function_field_name: ($) => choice($.qualified_name, $.identifier),
});
