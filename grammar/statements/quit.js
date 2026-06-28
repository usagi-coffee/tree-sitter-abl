module.exports = ({ kw }) => ({
  quit_statement: ($) => seq($.__quit_prefix, $._terminator),

  __quit_prefix: ($) => kw("QUIT"),
});
