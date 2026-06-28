module.exports = ({ kw }) => ({
  convert_statement: ($) => seq($.__convert_prefix, $._terminator),

  __convert_prefix: ($) => seq(kw("CONVERT"), $.__convert_body),
  __convert_body: ($) =>
    seq(
      kw("SOURCE"),
      kw("CODEPAGE"),
      field("source", $.string_literal),
      kw("TARGET"),
      kw("CODEPAGE"),
      field("target", $.string_literal),
    ),
});
