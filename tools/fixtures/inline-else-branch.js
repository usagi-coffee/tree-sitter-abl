export default ({ kw }) => ({
  if_statement: ($) =>
    seq(
      $._kw_if,
      prec.right(
        seq(
          $._expression,
          $._kw_then,
          field("then", $.__if_branch),
          optional(seq($._kw_else, field("else", $.__if_branch))),
        ),
      ),
    ),
  __if_branch: ($) =>
    choice(
      $._statement,
      alias($._end_of_file, $.empty_statement),
      alias($._block_end, $.empty_statement),
    ),
});
