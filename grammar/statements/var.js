module.exports = ({ kw }) => ({
  var_statement: ($) => seq(kw("VAR"), $.__var_body, $._terminator),

  __var_body: ($) =>
    seq(
      optional($.__var_modifier),
      $._var_type,
      alias($.__var_variable, $.variable),
      repeat(seq(",", alias($.__var_variable, $.variable))),
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
      $.preprocessor_name,
      $.identifier,
    ),
  __var_modifier: ($) =>
    choice(
      seq($.__var_access_modifier, optional($.__var_storage_modifier)),
      $.__var_storage_modifier,
    ),
  __var_access_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
    ),
  __var_storage_modifier: ($) =>
    choice(
      alias(kw("STATIC"), $.static_modifier),
      alias(kw("SERIALIZABLE"), $.serialization_modifier),
      alias(kw("NON-SERIALIZABLE"), $.serialization_modifier),
    ),
});
