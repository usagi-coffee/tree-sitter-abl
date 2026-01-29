module.exports = ({ kw }) => ({
  copy_lob_statement: ($) =>
    seq(kw("COPY-LOB"), $.__copy_lob_body, $._terminator),
  __copy_lob_body: ($) =>
    seq(
      kw("FROM"),
      kw("FILE"),
      $._expression,
      kw("TO"),
      $._expression,
      optional(alias($.__copy_lob_convert_phrase, $.convert_phrase)),
    ),

  __copy_lob_convert_phrase: ($) =>
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
