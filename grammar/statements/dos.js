export default ({ kw }) => ({
  dos_statement: ($) => seq($.__dos_prefix, $._terminator),

  __dos_prefix: ($) => seq(kw("DOS"), optional($._dos_unix_tail)),
});
