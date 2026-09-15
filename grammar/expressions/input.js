export default ({ kw }) => ({
  input_expression: ($) =>
    seq(
      $.__input_expression_prefix,
      optional($.__input_widget_phrase),
      field("field", $._input_field),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/keyword-reuse
  __input_expression_prefix: ($) => kw("INPUT"),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __input_widget_phrase: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("FRAME", { offset: 4 }), field("frame", $.identifier)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("BROWSE"), field("browse", $.identifier)),
    ),
});
