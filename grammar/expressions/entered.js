module.exports = ({ kw }) => ({
  entered_expression: ($) =>
    prec.right(-2, seq(
      field("field", $.identifier),
      kw("ENTERED"),
    )),
});
