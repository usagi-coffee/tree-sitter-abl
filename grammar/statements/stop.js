export default ({ kw }) => ({
  stop_statement: ($) => seq(kw("STOP"), $._terminator),
});
