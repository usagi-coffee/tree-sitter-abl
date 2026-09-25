export default ({ kw }) => ({
  convert_statement: ($) => seq($.__convert_prefix, $._terminator),

  __convert_prefix: ($) =>
    seq(
      $._kw_convert,
      $._kw_source,
      $._kw_codepage,
      field("source", $.string_literal),
      $._kw_target,
      $._kw_codepage,
      field("target", $.string_literal),
    ),
});
