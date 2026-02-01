module.exports = ({ kw }) => ({
  os_rename_statement: ($) =>
    seq(
      kw("OS-RENAME"),
      field("source", $._expression),
      field("target", $._expression),
      $._terminator,
    ),
});
