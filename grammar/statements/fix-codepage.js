module.exports = ({ tkw }) => ({
  fix_codepage_statement: ($) =>
    seq(
      tkw("FIX-CODEPAGE"),
      "(",
      field("target", $._expression),
      ")",
      "=",
      field("codepage", $._expression),
      $._terminator,
    ),
});
