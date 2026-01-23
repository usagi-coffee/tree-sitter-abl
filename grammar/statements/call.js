module.exports = ({ kw }) => ({
  call_statement: ($) =>
    seq(
      kw("CALL"),
      field("routine", $.identifier),
      repeat(field("argument", $._expression)),
      $._terminator,
    ),
});
