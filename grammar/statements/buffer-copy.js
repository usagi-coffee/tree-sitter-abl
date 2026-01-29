module.exports = ({ kw }) => ({
  buffer_copy_statement: ($) =>
    seq(kw("BUFFER-COPY"), $.__buffer_copy_body, $._terminator),

  __buffer_copy_body: ($) =>
    seq(
      field("source", $.__buffer_copy_record_name),
      optional(alias($.__buffer_copy_except_phrase, $.except_phrase)),
      kw("TO"),
      field("target", $.__buffer_copy_record_name),
    ),
  __buffer_copy_record_name: ($) => choice($.identifier, $.qualified_name),
  __buffer_copy_except_phrase: ($) =>
    seq(
      kw("EXCEPT"),
      $.__buffer_copy_field_name,
      repeat(seq(optional(","), $.__buffer_copy_field_name)),
    ),
  __buffer_copy_field_name: ($) => choice($.identifier, $.qualified_name),
});
