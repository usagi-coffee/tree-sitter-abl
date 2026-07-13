export default ({ kw }) => ({
  entered_expression: ($) =>
    choice(
      prec.right(-2, seq(field("field", $.identifier), $.__entered_operator)),
      prec.right(-2, seq($.__entered_operator, field("field", $.identifier))),
    ),
  __entered_operator: ($) => seq(optional(alias($._not_keyword, $.not)), kw("ENTERED")),
});
