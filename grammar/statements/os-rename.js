module.exports = ({ kw }) => ({
  os_rename_statement: ($) => seq(kw("OS-RENAME"), $.__os_rename_body, $._terminator),

  __os_rename_body: ($) => seq(field("source", $.__os_filename), field("target", $.__os_filename)),
});
