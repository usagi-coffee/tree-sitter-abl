module.exports = ({ kw, tkw }) => ({
  if_statement: ($) => seq(tkw("IF"), $.__if_body),

  __if_body: ($) =>
    prec.right(
      seq(
        $._expression,
        tkw("THEN"),
        field("then", $._statement),
        optional(seq(kw("ELSE"), field("else", $._statement)))
      )
    ),
});
