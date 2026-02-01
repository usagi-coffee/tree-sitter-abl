module.exports = ({ kw }) => ({
  os_append_statement: ($) =>
    seq(
      kw("OS-APPEND"),
      field("source", $._expression),
      field("target", $._expression),
      $._terminator,
    ),
});
