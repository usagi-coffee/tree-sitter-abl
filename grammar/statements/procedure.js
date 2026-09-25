export default ({ kw }) => ({
  procedure_definition: ($) => seq($.__procedure_header, alias($.__procedure_body, $.body)),

  __procedure_header: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._procedure_keyword,
      optional($._routine_access_modifier),
      field(
        "name",
        choice(
          $._identifier_or_qualified_name,
          $._routine_name_initial,
          alias($.__operator_name, $.identifier),
        ),
      ),
      optional($._routine_access_modifier),
      optional($.__procedure_options),
      optional(alias($.__procedure_in_super_phrase, $.in_super_phrase)),
    ),
  __procedure_options: ($) =>
    prec.right(seq($.__procedure_option, optional($.__procedure_options))),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __procedure_option: ($) =>
    choice(
      alias(kw("CDECL"), $.cdecl),
      seq($._kw_ordinal, field("ordinal", $.number_literal)),
      alias(kw("PERSISTENT"), $.persistent),
      alias(seq(kw("THREAD-SAFE"), optional(kw("SAFE"))), $.thread_safe),
      alias($.__procedure_external_phrase, $.external_phrase),
      seq(kw("MAP"), field("name", $.identifier)),
    ),

  __procedure_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/optional-body-extraction
    seq($.__procedure_compound_body, optional($._procedure_keyword), $._terminator),
  __procedure_compound_body: ($) =>
    seq(
      choice(alias($._colon, ":"), alias($._terminator_dot, ".")),
      optional($._statements),
      $._end_keyword,
    ),

  __procedure_in_super_phrase: ($) => seq($._in_keyword, $._kw_super),

  __procedure_external_phrase: ($) =>
    prec.left(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        kw("EXTERNAL"),
        field("library", alias($.string_literal, "_escaped_string")),
        optional(
          choice(
            // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
            alias(kw("CDECL"), $.cdecl),
            alias(kw("PASCAL"), $.pascal),
            alias(kw("STDCALL"), $.stdcall),
          ),
        ),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        optional(seq($._kw_ordinal, field("ordinal", $.number_literal))),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        optional(alias(kw("PERSISTENT"), $.persistent)),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        optional(alias(kw("THREAD-SAFE"), $.thread_safe)),
      ),
    ),
});
