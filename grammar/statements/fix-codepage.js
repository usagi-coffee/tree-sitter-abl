module.exports = ({ kw }) => ({
  fix_codepage_statement: ($) => seq($.__fix_codepage_prefix, $._terminator),

  __fix_codepage_prefix: ($) => seq(kw("FIX-CODEPAGE"), $.__fix_codepage_body),
  __fix_codepage_body: ($) =>
    seq(
      "(",
      field("target", $._identifier_or_qualified_name),
      ")",
      "=",
      field("codepage", $._expression),
    ),
});
