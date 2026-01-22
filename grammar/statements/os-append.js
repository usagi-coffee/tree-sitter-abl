module.exports = ({ kw, tkw }) => ({
  os_append_statement: ($) =>
    seq(
      tkw("OS-APPEND"),
      field("source", $._expression),
      field("target", $._expression),
      $._terminator,
    ),
});
