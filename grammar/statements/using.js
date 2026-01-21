module.exports = ({ kw }) => ({
  using_statement: ($) =>
    seq(
      kw("USING"),
      $._using_item,
      repeat(seq(",", $._using_item)),
      $._terminator,
    ),

  _using_item: ($) =>
    token(/[_\p{L}][\p{L}\p{N}_-]*(\.[_\p{L}][\p{L}\p{N}_-]*)*(\.\*)?/u),
});
