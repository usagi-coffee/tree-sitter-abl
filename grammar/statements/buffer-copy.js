module.exports = ({ kw }) => ({
  buffer_copy_statement: ($) =>
    seq(kw("BUFFER-COPY"), $.__buffer_copy_body, $._terminator),

  __buffer_copy_body: ($) =>
    seq(
      field("source", $.__buffer_copy_record_name),
      optional(
        choice(
          alias($.__buffer_copy_except_phrase, $.except_phrase),
          alias($.__buffer_copy_using_phrase, $.using_phrase),
        ),
      ),
      kw("TO"),
      field("target", $.__buffer_copy_record_name),
      optional(alias($.__buffer_copy_assign_phrase, $.assign_phrase)),
      optional(kw("NO-LOBS")),
      optional(alias($.__buffer_copy_no_error, $.no_error)),
    ),

  __buffer_copy_record_name: ($) => $._identifier_or_qualified_name,
  __buffer_copy_except_phrase: ($) =>
    seq(
      kw("EXCEPT"),
      $.__buffer_copy_field_name,
      repeat(seq(optional(","), $.__buffer_copy_field_name)),
    ),
  __buffer_copy_using_phrase: ($) =>
    seq(
      kw("USING"),
      $.__buffer_copy_field_name,
      repeat(seq(optional(","), $.__buffer_copy_field_name)),
    ),
  __buffer_copy_field_name: ($) => $._identifier_or_qualified_name,
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
  __buffer_copy_no_error: ($) => kw("NO-ERROR"),
});
