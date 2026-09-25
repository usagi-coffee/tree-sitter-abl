export default ({ kw }) => ({
  // oxlint-disable-next-line tree-sitter-optimize/optional-body-extraction
  disable_statement: ($) => seq($._kw_disable, optional($.__disable_body), $._terminator),

  __disable_body: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      $.__disable_items,
      optional($.frame_phrase),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __disable_items: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      seq(alias(kw("ALL"), $.all), optional($._except_fields)),
      $.__disable_items_list,
    ),
  __disable_items_list: ($) =>
    prec.right(seq(alias($.__disable_item, $.disable_item), optional($.__disable_items_list))),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __disable_item: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        field("field", $._identifier_or_array_access),
        optional($._format_phrases),
        optional($._when_phrase),
      ),
      seq($._kw_text, "(", token(/[A-Za-z_][A-Za-z0-9_-]*/), optional($._format_phrases), ")"),
      seq(field("constant", $.string_literal), optional($._format_phrases)),
      alias($._kw_skip, $.skip),
    ),
});
