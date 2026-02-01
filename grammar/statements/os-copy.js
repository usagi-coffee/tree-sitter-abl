module.exports = ({ kw }) => ({
  os_copy_statement: ($) =>
    seq(
      kw("OS-COPY"),
      field("source", $._expression),
      field("target", $._expression),
      $._terminator,
    ),
});
