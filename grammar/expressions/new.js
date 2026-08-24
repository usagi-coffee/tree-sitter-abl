export default ({ kw }) => ({
  new_expression: ($) =>
    seq(
      $._new_keyword,
      choice(
        // Class constructor: NEW ClassName(args)
        seq(
          field("type", choice($.scoped_name, $._identifier_or_qualified_name, $.string_literal)),
          $.arguments,
        ),
        // Record buffer check: NEW record or NEW(record)
        prec.right(
          choice(field("record", $._identifier_or_qualified_name), seq($.__new_record_opener, ")")),
        ),
      ),
    ),
  __new_record_opener: ($) => seq("(", field("record", $._identifier_or_qualified_name)),
});
