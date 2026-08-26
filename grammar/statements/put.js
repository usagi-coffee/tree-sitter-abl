export default ({ kw }) => ({
  put_statement: ($) => seq(kw("PUT"), $.__put_body, $._terminator),

  __put_body: ($) => seq(optional($._stream_phrase), $.__put_output),
  __put_output: ($) =>
    choice(
      seq(
        optional(alias(kw("UNFORMATTED"), $.unformatted)),
        prec.right(seq($.__put_output_item, optional($.__put_output_items_tail))),
      ),
      alias(seq(kw("CONTROL"), $.__put_controls), $.control_phrase),
    ),
  __put_output_items_tail: ($) =>
    prec.right(seq($.__put_output_item, optional($.__put_output_items_tail))),
  __put_output_item: ($) =>
    choice(
      $.__put_expression_item,
      alias($.__put_skip_item, $.skip),
      alias($.__put_space_item, $.space),
    ),
  __put_control: ($) => $._expression,
  __put_controls: ($) => prec.right(seq($.__put_control, optional($.__put_controls))),

  __put_expression_item: ($) =>
    prec.left(
      seq(
        field("value", $._expression),
        optional($.format_phrase),
        optional(seq(choice($._at_keyword, $._to_keyword), field("position", $._expression))),
      ),
    ),

  __put_skip_item: ($) => prec.right(seq(kw("SKIP"), optional($.__put_parenthesized_count))),

  __put_space_item: ($) => prec.right(seq(kw("SPACE"), optional($.__put_parenthesized_count))),
  __put_parenthesized_count: ($) => seq("(", field("count", $._expression), ")"),
});
