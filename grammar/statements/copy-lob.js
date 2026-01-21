module.exports = ({ kw }) => ({
  copy_lob_statement: ($) =>
    seq(
      kw("COPY-LOB"),
      kw("FROM"),
      kw("FILE"),
      $._expression,
      kw("TO"),
      $._expression,
      optional(alias($.__copy_lob_convert_clause, $.convert_clause)),
      $._terminator,
    ),

  __copy_lob_convert_clause: ($) =>
    seq(
      kw("CONVERT"),
      kw("SOURCE"),
      kw("CODEPAGE"),
      $.string_literal,
      kw("TARGET"),
      kw("CODEPAGE"),
      $.string_literal,
    ),
});
