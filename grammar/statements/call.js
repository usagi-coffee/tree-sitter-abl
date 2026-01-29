module.exports = ({ kw }) => ({
  call_statement: ($) => seq(kw("CALL"), $.__call_body, $._terminator),
  __call_body: ($) =>
    seq(
      field("routine", $.identifier),
      repeat(field("argument", $._expression)),
    ),
});
