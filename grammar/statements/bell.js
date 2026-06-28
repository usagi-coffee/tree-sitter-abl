module.exports = ({ kw }) => ({
  bell_statement: ($) => seq($.__bell_prefix, $._terminator),

  __bell_prefix: ($) => kw("BELL"),
});
