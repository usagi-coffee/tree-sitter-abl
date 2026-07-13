export default ({ kw }) => ({
  call_statement: ($) => seq($.__call_prefix, $._terminator),

  __call_prefix: ($) =>
    seq(kw("CALL"), field("routine", $.identifier), repeat(alias($.__call_argument, $.argument))),

  __call_argument: ($) => $._expression,
});
