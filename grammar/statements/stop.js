export default ({ kw }) => ({
  stop_statement: ($) => seq($.__stop_prefix, $._terminator),

  __stop_prefix: ($) => kw("STOP"),
});
