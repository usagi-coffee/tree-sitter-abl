module.exports = ({ kw }) => ({
  buffer_copy_statement: ($) =>
    seq(
      kw("BUFFER-COPY"),
      field("source", $.__buffer_copy_record_name),
      optional(alias($.__buffer_copy_except_clause, $.except_clause)),
      kw("TO"),
      field("target", $.__buffer_copy_record_name),
      $._terminator,
    ),

  __buffer_copy_record_name: ($) => choice($.identifier, $.qualified_name),
  __buffer_copy_except_clause: ($) =>
    seq(
      kw("EXCEPT"),
      $.__buffer_copy_field_name,
      repeat(
        seq(
          optional(","),
          $.__buffer_copy_field_name,
        ),
      ),
    ),
  __buffer_copy_field_name: ($) => choice($.identifier, $.qualified_name),
});
