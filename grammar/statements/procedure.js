module.exports = ({ kw }) => ({
  procedure_definition: ($) =>
    seq(
      kw("PROCEDURE", { offset: 4 }),
      optional($.__procedure_modifier),
      field("name", $._identifier_or_qualified_name),
      repeat($.__procedure_option),
      optional(alias(seq(kw("IN"), kw("SUPER")), $.in_super_phrase)),
      alias($.__procedure_body, $.body),
    ),

  __procedure_body: ($) =>
    seq(
      choice(alias($._colon, ":"), alias($._terminator_dot, ".")),
      repeat($._statement),
      kw("END"),
      optional(kw("PROCEDURE", { offset: 4 })),
      $._terminator,
    ),

  __procedure_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
    ),

  __procedure_option: ($) =>
    choice(
      alias(kw("CDECL"), $.cdecl),
      alias(seq(kw("ORDINAL"), field("number", $.number_literal)), $.ordinal_phrase),
      alias(kw("PERSISTENT"), $.persistent),
      alias(seq(kw("THREAD-SAFE"), optional(kw("SAFE"))), $.thread_safe),
      alias($.__procedure_external_phrase, $.external_phrase),
      alias(seq(kw("MAP"), field("name", $.identifier)), $.map),
    ),

  __procedure_external_phrase: ($) =>
    prec.left(
      seq(
        kw("EXTERNAL"),
        field("library", $._escaped_string),
        optional(
          choice(
            alias(kw("CDECL"), $.cdecl),
            alias(kw("PASCAL"), $.pascal),
            alias(kw("STDCALL"), $.stdcall),
          ),
        ),
        optional(seq(kw("ORDINAL"), $.number_literal)),
        optional(alias(kw("PERSISTENT"), $.persistent)),
        optional(alias(kw("THREAD-SAFE"), $.thread_safe)),
      ),
    ),
});
