export default ({ kw }) => ({
  call_statement: ($) => seq($.__call_prefix, $._terminator),

  __call_prefix: ($) =>
    seq(kw("CALL"), field("routine", $.identifier), optional($.__call_arguments)),

  __call_arguments: ($) =>
    prec.right(seq(alias($.__call_argument, $.argument), optional($.__call_arguments))),

  __call_argument: ($) => $._expression,
});
