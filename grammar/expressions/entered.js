module.exports = ({ kw }) => ({
  entered_expression: ($) =>
    choice(
      prec.right(-2, seq(field("field", $.identifier), $.__entered_operator)),
      prec.right(-2, seq($.__entered_operator, field("field", $.identifier))),
    ),
  __entered_operator: ($) => seq(optional(alias(kw("NOT"), $.not)), kw("ENTERED")),
});
