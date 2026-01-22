module.exports = ({ kw, tkw }) => ({
  os_copy_statement: ($) =>
    seq(
      tkw("OS-COPY"),
      field("source", $._expression),
      field("target", $._expression),
      $._terminator,
    ),
});
