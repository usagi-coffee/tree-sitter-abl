export default ({ kw }) => ({
  new_expression: ($) =>
    seq(
      $._new_keyword,
      choice(
        // Class constructor: NEW ClassName(args) or NEW ClassName<T>(args)
        seq(
          field(
            "type",
            choice(
              $.scoped_name,
              $._identifier_or_qualified_name,
              $.string_literal,
              alias($.__new_generic_type, $.generic_type),
            ),
          ),
          $.arguments,
        ),
        // Record buffer check: NEW record or NEW(record)
        prec.right(
          choice(field("record", $._identifier_or_qualified_name), seq($.__new_record_opener, ")")),
        ),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __new_record_opener: ($) => seq("(", field("record", $._identifier_or_qualified_name)),
  // Keep generic constructor names local to NEW to limit parser state growth.
  // TODO: Cover scoped, nested, and macro-based generic constructor names.
  __new_generic_type: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      choice($.qualified_name, $.identifier),
      "<",
      $._type_name,
      optional($._generic_type_arguments_tail),
      ">",
    ),
});
