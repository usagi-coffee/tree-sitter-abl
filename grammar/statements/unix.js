module.exports = ({ kw }) => ({
  unix_statement: ($) => seq(kw("UNIX"), optional($._dos_unix_tail), $._terminator),
});
