const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  var_statement: ($) => seq(kw("VAR"), $.__var_body, $._terminator),

  __var_body: ($) =>
    seq(
      ...definitionModifiers($, kw, {
        access: [
          "PRIVATE",
          "PACKAGE-PRIVATE",
          "PROTECTED",
          "PACKAGE-PROTECTED",
          "PUBLIC",
        ],
        static: true,
        serializable: true,
      }),
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
      alias($.constant_expression, $.constant),
      $.identifier,
    ),
});
