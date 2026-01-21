module.exports = ({ kw }) => ({
  if_statement: ($) =>
    prec.right(
      seq(
        choice(
          seq(kw("IF"), $._expression),
          seq(token(/IF\(/i), $._expression, ")"),
        ),
        kw("THEN"),
        field("then", choice($.do_block, $._statement)),
        optional(
          seq(kw("ELSE"), field("else", choice($.do_block, $._statement))),
        ),
      ),
    ),
});
