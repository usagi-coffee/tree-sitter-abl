module.exports = ({ kw }) => ({
  display_statement: ($) =>
    seq(
      choice(kw("DISPLAY"), token(seq(/DISP(LAY)?/i, /\s+/))),
      repeat1($._display_item),
      $._terminator,
    ),

  _display_item: ($) =>
    prec.right(
      seq($._expression, optional($.aggregate_phrase)),
    ),
});
