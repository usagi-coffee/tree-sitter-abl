module.exports = ({ kw }) => ({
  entered_expression: ($) =>
    choice(
      prec.right(-2, seq(field("field", $.identifier), kw("ENTERED"))),
      prec.right(-2, seq(kw("ENTERED"), field("field", $.identifier))),
    ),

  not_entered_expression: ($) =>
    choice(
      prec.right(-2, seq(field("field", $.identifier), kw("NOT"), kw("ENTERED"))),
      prec.right(-2, seq(kw("NOT"), kw("ENTERED"), field("field", $.identifier))),
    ),
});
