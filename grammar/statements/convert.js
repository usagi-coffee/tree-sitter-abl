module.exports = ({ kw }) => ({
  convert_statement: ($) =>
    seq(
      kw("CONVERT"),
      kw("SOURCE"),
      kw("CODEPAGE"),
      field("source", $.string_literal),
      kw("TARGET"),
      kw("CODEPAGE"),
      field("target", $.string_literal),
      $._terminator,
    ),
});
