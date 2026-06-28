module.exports = ({ kw }) => ({
  entered_expression: ($) =>
    choice(
      prec.right(
        -2,
        seq(field("field", $.identifier), optional(alias(kw("NOT"), $.not)), $.__entered_keyword),
      ),
      prec.right(
        -2,
        seq(optional(alias(kw("NOT"), $.not)), $.__entered_keyword, field("field", $.identifier)),
      ),
    ),

  __entered_keyword: ($) => kw("ENTERED"),
});
