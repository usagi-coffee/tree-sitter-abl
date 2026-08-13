export default ({ kw }) => ({
  up_statement: ($) => seq($.__up_prefix, $._terminator),

  __up_prefix: ($) => seq(kw("UP"), optional($._up_down_tail)),
});
