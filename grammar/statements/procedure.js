export default ({ kw }) => ({
  procedure_definition: ($) => seq($.__procedure_header, alias($.__procedure_body, $.body)),

  __procedure_header: ($) =>
    seq(
      kw("PROCEDURE", { offset: 4 }),
      optional($._routine_access_modifier),
      field(
        "name",
        choice(
          $._identifier_or_qualified_name,
          $._routine_name_initial,
          alias($.__operator_routine_name, $.identifier),
        ),
      ),
      optional($._routine_access_modifier),
      optional($.__procedure_options),
      optional(alias($.__procedure_in_super_phrase, $.in_super_phrase)),
    ),
  __procedure_options: ($) =>
    prec.right(
      seq(
        choice(
          alias(kw("CDECL"), $.cdecl),
          seq(kw("ORDINAL"), field("ordinal", $.number_literal)),
          alias(kw("PERSISTENT"), $.persistent),
          alias(seq(kw("THREAD-SAFE"), optional(kw("SAFE"))), $.thread_safe),
          alias($.__procedure_external_phrase, $.external_phrase),
          seq(kw("MAP"), field("name", $.identifier)),
        ),
        optional($.__procedure_options),
      ),
    ),

  __procedure_body: ($) =>
    seq($.__procedure_compound_body, optional(kw("PROCEDURE", { offset: 4 })), $._terminator),
  __procedure_compound_body: ($) =>
    seq(
      choice(alias($._colon, ":"), alias($._terminator_dot, ".")),
      optional($._statements),
      $._end_keyword,
    ),

  __procedure_in_super_phrase: ($) => seq($._in_keyword, kw("SUPER")),

  __procedure_external_phrase: ($) =>
    prec.left(
      seq(
        kw("EXTERNAL"),
        field("library", alias($.string_literal, "_escaped_string")),
        optional(
          choice(
            alias(kw("CDECL"), $.cdecl),
            alias(kw("PASCAL"), $.pascal),
            alias(kw("STDCALL"), $.stdcall),
          ),
        ),
        optional(seq(kw("ORDINAL"), field("ordinal", $.number_literal))),
        optional(alias(kw("PERSISTENT"), $.persistent)),
        optional(alias(kw("THREAD-SAFE"), $.thread_safe)),
      ),
    ),
});
