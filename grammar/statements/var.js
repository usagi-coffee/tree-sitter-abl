module.exports = ({ kw }) => ({
  var_statement: ($) =>
    seq(
      kw("VAR"),
      optional(alias($.__var_access_modifier, $.access_modifier)),
      optional(
        choice(
          alias($.__var_static_modifier, $.static_modifier),
          alias($.__var_serialization_modifier, $.serialization_modifier),
        ),
      ),
      $._var_type,
      alias($.__var_variable, $.variable),
      repeat(seq(",", alias($.__var_variable, $.variable))),
      $._terminator,
    ),

  _var_type: ($) =>
    seq(
      optional(kw("CLASS")),
      field("type", $._type_or_string),
      optional(field("extent", $.__var_extent)),
    ),

  __var_variable: ($) =>
    seq(
      field("name", $.identifier),
      optional(field("extent", $.__var_extent)),
      optional(field("initializer", $.__var_initializer)),
    ),

  __var_initializer: ($) =>
    seq("=", choice($.array_initializer, $._expression)),
  __var_extent: ($) => seq("[", optional($.__var_extent_size), "]"),
  __var_extent_size: ($) =>
    choice(
      $.number_literal,
      alias($.constant_expression, $.constant),
      $.identifier,
    ),

  __var_access_modifier: ($) =>
    choice(
      kw("PRIVATE"),
      kw("PACKAGE-PRIVATE"),
      kw("PROTECTED"),
      kw("PACKAGE-PROTECTED"),
      kw("PUBLIC"),
    ),
  __var_static_modifier: ($) => kw("STATIC"),
  __var_serialization_modifier: ($) =>
    choice(kw("SERIALIZABLE"), kw("NON-SERIALIZABLE")),
});
