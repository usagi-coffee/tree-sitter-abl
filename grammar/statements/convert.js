export default ({ kw }) => ({
  convert_statement: ($) => seq($.__convert_prefix, $._terminator),

  __convert_prefix: ($) =>
    seq(
      kw("CONVERT"),
      kw("SOURCE"),
      $._kw_codepage,
      field("source", $.string_literal),
      kw("TARGET"),
      $._kw_codepage,
      field("target", $.string_literal),
    ),
});
