module.exports = ({ kw }) => ({
  os_rename_statement: ($) =>
    seq(kw("OS-RENAME"), $.__os_rename_body, $._terminator),

  __os_rename_body: ($) =>
    seq(
      field("source", $.__os_rename_filename),
      field("target", $.__os_rename_filename),
    ),

  __os_rename_filename: ($) =>
    choice(
      $.string_literal,
      $._identifier_or_access_or_call,
    ),
});
