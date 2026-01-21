module.exports = ({ kw }) => ({
  var_statement: ($) =>
    seq(
      kw("VAR"),
      optional(alias($.__var_access_modifier, $.access_modifier)),
      $._var_type,
      $.var_decl,
      repeat(seq(",", $.var_decl)),
      $._terminator,
    ),

  _var_type: ($) =>
    seq(
      optional(kw("CLASS")),
      field("type", $._type_or_string),
      optional($.var_extent),
    ),

  var_decl: ($) =>
    seq(
      field("name", $.identifier),
      optional($.var_extent),
      optional($.var_init),
    ),

  var_init: ($) => seq("=", choice($.array_initializer, $._expression)),
  var_extent: ($) => seq("[", optional($.__var_extent_size), "]"),
  __var_extent_size: ($) => choice($.number_literal, $.constant, $.identifier),

  __var_access_modifier: ($) =>
    choice(
      kw("PRIVATE"),
      kw("PACKAGE-PRIVATE"),
      kw("PROTECTED"),
      kw("PACKAGE-PROTECTED"),
      kw("PUBLIC"),
    ),
});
