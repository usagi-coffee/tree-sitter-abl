module.exports = ({ kw }) => ({
  buffer_copy_statement: ($) =>
    seq(kw("BUFFER-COPY"), $.__buffer_copy_body, $._terminator),

  __buffer_copy_body: ($) =>
    seq(
      field("source", $._identifier_or_qualified_name),
      optional(
        choice(
          alias($.__buffer_copy_except_phrase, $.except_phrase),
          alias($.__buffer_copy_using_phrase, $.using_phrase),
        ),
      ),
      kw("TO"),
      field("target", $._identifier_or_qualified_name),
      optional(alias($.__buffer_copy_assign_phrase, $.assign_phrase)),
      optional(alias(kw("NO-LOBS"), $.no_lobs)),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),
  __buffer_copy_except_phrase: ($) =>
    seq(
      kw("EXCEPT"),
      $._identifier_or_qualified_name,
      repeat(seq(optional(","), $._identifier_or_qualified_name)),
    ),
  __buffer_copy_using_phrase: ($) =>
    seq(
      kw("USING"),
      $._identifier_or_qualified_name,
      repeat(seq(optional(","), $._identifier_or_qualified_name)),
    ),
  __buffer_copy_assign_phrase: ($) =>
    seq(
      kw("ASSIGN"),
      repeat1(alias($.__buffer_copy_assign_pair, $.assign_pair)),
    ),
  __buffer_copy_assign_pair: ($) =>
    seq(
      field("left", $._assignable),
      choice("=", "+=", "-=", "*=", "/="),
      field("right", $._expression),
    ),
});
