module.exports = ({ kw }) => ({
  dos_statement: ($) => seq(kw("DOS"), optional($._dos_unix_tail), $._terminator),
});
