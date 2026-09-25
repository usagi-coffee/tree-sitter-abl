export default ({ kw }) => ({
  if_statement: ($) =>
    seq(
      $._kw_if,
      prec.right(
        seq(
          $._expression,
          $._kw_then,
          field("then", $._statement),
          optional(seq($._kw_else, field("else", $._statement))),
        ),
      ),
    ),
});
