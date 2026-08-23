export default ({ kw }) => ({
  if_statement: ($) =>
    seq(
      kw("IF"),
      prec.right(
        seq(
          $._expression,
          kw("THEN"),
          field("then", $._statement),
          optional(seq(kw("ELSE"), field("else", $._statement))),
        ),
      ),
    ),
});
