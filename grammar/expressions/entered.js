export default ({ kw }) => ({
  entered_expression: ($) =>
    prec.right(
      -2,
      choice(
        seq(field("field", $.identifier), $.__entered_operator),
        seq($.__entered_operator, field("field", $.identifier)),
      ),
    ),
  __entered_operator: ($) => seq(optional(alias($._not_keyword, $.not)), kw("ENTERED")),
});
