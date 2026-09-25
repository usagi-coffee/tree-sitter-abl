export default ({ kw }) => ({
  choose_statement: ($) => seq($.__choose_prefix, $._terminator),

  __choose_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("CHOOSE"),
      choice(seq($._row_keyword, $.__choose_field_help), seq(kw("FIELD"), $.__choose_field_helps)),
      optional($.__choose_options),
      optional($.frame_phrase),
    ),
  __choose_field_help: ($) =>
    seq(
      field("field", $._identifier_or_qualified_name),
      optional(
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._help_keyword, field("help", $.string_literal)),
      ),
    ),
  __choose_field_helps: ($) =>
    prec.right(seq($.__choose_field_help, optional($.__choose_field_helps))),
  __choose_options: ($) => prec.right(seq($.__choose_option, optional($.__choose_options))),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __choose_option: ($) =>
    choice(
      alias($._kw_auto_return, $.auto_return),
      seq(kw("COLOR"), field("color", $.color_phrase)),
      alias($._go_on_phrase, $.go_on),
      seq(kw("KEYS"), field("keys", $.identifier)),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-ERROR"), $.no_error),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
      seq(kw("PAUSE"), field("pause", $._expression)),
    ),
});
