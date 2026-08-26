export default ({ kw }) => ({
  os_copy_statement: ($) => seq($.__os_copy_prefix, $._terminator),

  __os_copy_prefix: ($) =>
    seq(
      kw("OS-COPY"),
      field("source", $._string_or_identifier_access_or_call),
      field("target", $._string_or_identifier_access_or_call),
    ),
});
