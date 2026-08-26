export default ({ kw }) => ({
  os_rename_statement: ($) => seq($.__os_rename_prefix, $._terminator),

  __os_rename_prefix: ($) =>
    seq(
      kw("OS-RENAME"),
      field("source", $._string_or_identifier_access_or_call),
      field("target", $._string_or_identifier_access_or_call),
    ),
});
