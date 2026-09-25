export default ({ kw }) => ({
  var_statement: ($) => seq($.__var_prefix, $._terminator),

  __var_prefix: ($) =>
    seq(kw("VAR"), optional($.__var_modifier), $._var_type, $.__var_variable_suffix),
  __var_variable_suffix: ($) =>
    seq(alias($.__var_variable, $.variable), optional(seq(",", $.__var_variable_suffix))),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _var_type: ($) => seq($._class_type, optional(field("extent", seq($.__var_extent_prefix, "]")))),

  __var_variable: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("name", $.identifier),
      optional(field("extent", seq($.__var_extent_prefix, "]"))),
      optional(field("initializer", $.__var_initializer)),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-field-sequence
  __var_initializer: ($) => seq("=", $._assignment_value),
  __var_extent_prefix: ($) =>
    seq(
      "[",
      optional(
        // oxlint-disable-next-line tree-sitter-optimize/shared-choice
        choice($.number_literal, $.preprocessor_name, $.identifier),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __var_modifier: ($) =>
    choice(
      seq($._member_access_modifier, optional($.__var_storage_modifier)),
      $.__var_storage_modifier,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/choice-subset
  __var_storage_modifier: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("STATIC"), $.static_modifier),
      alias(kw("SERIALIZABLE"), $.serialization_modifier),
      alias(kw("NON-SERIALIZABLE"), $.serialization_modifier),
    ),
});
