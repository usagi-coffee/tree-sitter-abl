module.exports = ({ kw }) => ({
  os_rename_statement: ($) => seq($.__os_rename_prefix, $._terminator),

  __os_rename_prefix: ($) => seq(kw("OS-RENAME"), $.__os_rename_body),
  __os_rename_body: ($) => seq(field("source", $._os_filename), field("target", $._os_filename)),
});
