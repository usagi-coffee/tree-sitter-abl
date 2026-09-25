export default ({ kw }) => ({
  put_statement: ($) => seq($._kw_put, $.__put_body, $._terminator),

  __put_body: ($) => seq(optional($._stream_phrase), $.__put_output),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __put_output: ($) =>
    choice(
      seq(optional(alias(kw("UNFORMATTED"), $.unformatted)), $.__put_output_items_tail),
      alias(seq(kw("CONTROL"), $._expression_list), $.control_phrase),
    ),
  __put_output_items_tail: ($) =>
    prec.right(seq($.__put_output_item, optional($.__put_output_items_tail))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/body-extraction
  __put_output_item: ($) =>
    choice(
      prec.left(
        "put_expression_item",
        // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
        seq(
          field("value", $._expression),
          optional($.format_phrase),
          optional(
            seq(
              // oxlint-disable-next-line tree-sitter-optimize/shared-choice
              choice($._at_keyword, $._to_keyword),
              field("position", $._expression),
            ),
          ),
        ),
      ),
      alias($.__put_skip_item, $.skip),
      alias($.__put_space_item, $.space),
    ),

  __put_skip_item: ($) => prec.right(seq($._kw_skip, optional($.__put_parenthesized_count))),

  __put_space_item: ($) => prec.right(seq($._kw_space, optional($.__put_parenthesized_count))),
  // oxlint-disable-next-line tree-sitter-optimize/closing-delimiter-hoist
  __put_parenthesized_count: ($) => seq("(", field("count", $._expression), ")"),
});
