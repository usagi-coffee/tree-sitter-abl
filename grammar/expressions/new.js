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
  __new_record_opener: ($) => seq("(", field("record", $._identifier_or_qualified_name)),
  // A private copy of the generic_type/_simple_type_name machinery, scoped
  // to NEW's own type field. generic_type/_simple_type_name are shared by
  // ~18 other call sites (variable/parameter typing); reusing them here
  // would reopen the qualified-name-vs-identifier ambiguity at every one of
  // those sites too, on every future refactor of their internals (see
  // 65b55edf). This duplicates only the two base-name alternatives that
  // actually occur after NEW (a dotted .NET name or a bare class name),
  // leaving the shared type-name rules and their existing 18 call sites
  // completely untouched.
  __new_generic_type: ($) => seq($.__new_generic_type_prefix, ">"),
  __new_generic_type_prefix: ($) =>
    seq(
      choice($.qualified_name, $.identifier),
      "<",
      $._type_name,
      optional($.__generic_type_arguments_tail),
    ),
});
