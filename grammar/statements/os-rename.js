module.exports = ({ kw, tkw }) => ({
  os_rename_statement: ($) =>
    seq(
      tkw("OS-RENAME"),
      field("source", $._expression),
      field("target", $._expression),
      $._terminator,
    ),
});
