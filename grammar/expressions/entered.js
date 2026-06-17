module.exports = ({ kw }) => ({
  entered_expression: ($) =>
    choice(
      prec.right(
        -2,
        seq(field("field", $.identifier), optional(alias(kw("NOT"), $.not)), kw("ENTERED")),
      ),
      prec.right(
        -2,
        seq(optional(alias(kw("NOT"), $.not)), kw("ENTERED"), field("field", $.identifier)),
      ),
    ),
});
