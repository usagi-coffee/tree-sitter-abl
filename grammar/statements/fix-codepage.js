module.exports = ({ kw }) => ({
  fix_codepage_statement: ($) =>
    seq(kw("FIX-CODEPAGE"), $.__fix_codepage_body, $._terminator),

  __fix_codepage_body: ($) =>
    seq(
      "(",
      field("target", $._identifier_or_qualified_name),
      ")",
      "=",
      field("codepage", $._expression),
    ),
});
