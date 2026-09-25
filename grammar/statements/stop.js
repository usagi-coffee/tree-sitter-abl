export default ({ kw }) => ({
  stop_statement: ($) => seq($._kw_stop, $._terminator),
});
