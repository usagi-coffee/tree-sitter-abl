module.exports = ({ kw }) => ({
  fix_codepage_statement: ($) => seq($.__fix_codepage_prefix, $._terminator),

  __fix_codepage_prefix: ($) =>
    seq(
      kw("FIX-CODEPAGE"),
      "(",
      field("target", $._identifier_or_qualified_name),
      ")",
      "=",
      field("codepage", $._expression),
    ),
});
