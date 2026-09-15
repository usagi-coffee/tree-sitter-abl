export default ({ kw }) => ({
  os_append_statement: ($) => seq($.__os_append_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __os_append_prefix: ($) =>
    seq(
      kw("OS-APPEND"),
      field("source", $._string_or_identifier_access_or_call),
      field("target", $._string_or_identifier_access_or_call),
    ),
});
