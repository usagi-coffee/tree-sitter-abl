export default ({ kw }) => ({
  fix_codepage_statement: ($) => seq($.__fix_codepage_prefix, $._terminator),

  __fix_codepage_prefix: ($) =>
    seq(
      kw("FIX-CODEPAGE"),
      "(",
      field("target", $._qualified_identifier),
      ")",
      "=",
      field("codepage", $._expression),
    ),
});
