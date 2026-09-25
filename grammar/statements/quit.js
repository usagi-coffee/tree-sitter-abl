export default ({ kw }) => ({
  quit_statement: ($) => seq($._kw_quit, $._terminator),
});
