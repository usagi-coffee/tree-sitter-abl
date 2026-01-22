module.exports = ({ kw, tkw }) => ({
  if_statement: ($) =>
    prec.right(
      seq(
        choice(
          seq(kw("IF"), $._expression),
          seq(tkw("IF"), "(", $._expression, ")"),
        ),
        kw("THEN"),
        field("then", choice($.do_block, $._statement)),
        optional(
          seq(kw("ELSE"), field("else", choice($.do_block, $._statement))),
        ),
      ),
    ),
});
