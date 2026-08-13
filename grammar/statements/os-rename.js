export default ({ kw }) => ({
  os_rename_statement: ($) => seq($.__os_rename_prefix, $._terminator),

  __os_rename_prefix: ($) =>
    seq(kw("OS-RENAME"), field("source", $._os_filename), field("target", $._os_filename)),
});
