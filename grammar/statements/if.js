module.exports = ({ kw }) => ({
  if_statement: ($) => seq(kw("IF"), $.__if_body),

  __if_body: ($) =>
    prec.right(
      seq(
        $._expression,
        kw("THEN"),
        field("then", $._statement),
        optional(seq(kw("ELSE"), field("else", $._statement))),
      ),
    ),
});
