export default ({ kw }) => ({
  color_statement: ($) => seq($.__color_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __color_prefix: ($) => seq(kw("COLOR"), optional($.__color_body)),

  __color_body: ($) =>
    seq(optional(choice(alias($._kw_display, $.display), $._kw_prompt)), $.__color_tail),

  __color_tail: ($) =>
    seq(
      field("color", $.color_phrase),
      optional(seq($._kw_prompt, field("prompt_color", $.color_phrase))),
      $.__color_targets,
      optional($.frame_phrase),
    ),
  __color_targets: ($) =>
    prec.right(
      seq(
        choice($._identifier_or_qualified_name, $.scoped_name, $.input_expression),
        optional($.__color_targets),
      ),
    ),
});
