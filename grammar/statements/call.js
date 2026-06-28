module.exports = ({ kw }) => ({
  call_statement: ($) => seq($.__call_prefix, $._terminator),

  __call_prefix: ($) => seq(kw("CALL"), $.__call_body),
  __call_body: ($) =>
    seq(field("routine", $.identifier), repeat(alias($.__call_argument, $.argument))),

  __call_argument: ($) => $._expression,
});
