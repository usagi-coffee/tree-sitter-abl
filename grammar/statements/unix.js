module.exports = ({ kw }) => ({
  unix_statement: ($) => seq($.__unix_prefix, $._terminator),

  __unix_prefix: ($) => seq(kw("UNIX"), optional($._dos_unix_tail)),
});
