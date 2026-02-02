module.exports = ({ kw }) => ({
  call_statement: ($) => seq(kw("CALL"), $.__call_body, $._terminator),

  __call_body: ($) =>
    seq(
      field("routine", $.identifier),
      repeat(alias($.__call_argument, $.argument)),
    ),

  __call_argument: ($) => $._expression,
});
