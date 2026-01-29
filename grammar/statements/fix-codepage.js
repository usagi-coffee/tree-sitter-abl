module.exports = ({ tkw }) => ({
  fix_codepage_statement: ($) =>
    seq(tkw("FIX-CODEPAGE"), $.__fix_codepage_body, $._terminator),

  __fix_codepage_body: ($) =>
    seq(
      "(",
      field("target", $._expression),
      ")",
      "=",
      field("codepage", $._expression),
    ),
});
