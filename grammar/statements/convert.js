module.exports = ({ kw }) => ({
  convert_statement: ($) => seq(kw("CONVERT"), $.__convert_body, $._terminator),

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
