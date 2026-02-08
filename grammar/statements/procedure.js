module.exports = ({ kw }) => ({
  procedure_definition: ($) =>
    seq(
      kw("PROCEDURE", { offset: 4 }),
      optional($.__procedure_modifier),
      field("name", $._identifier_or_qualified_name),
      repeat($.__procedure_option),
      optional(alias($.__procedure_in_super_phrase, $.in_super_phrase)),
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

  __procedure_access_modifier: ($) =>
    choice(kw("PRIVATE"), kw("PROTECTED"), kw("PUBLIC")),
  __procedure_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
    ),

  __procedure_option: ($) =>
    choice(
      alias($.__procedure_cdecl_option, $.cdecl),
      alias($.__procedure_ordinal_option, $.ordinal_phrase),
      alias($.__procedure_persistent_option, $.persistent),
      alias($.__procedure_thread_safe_option, $.thread_safe),
      alias($.__procedure_external_phrase, $.external_phrase),
      alias($.__procedure_map_option, $.map),
    ),

  __procedure_cdecl_option: ($) => kw("CDECL"),
  __procedure_ordinal_option: ($) =>
    seq(kw("ORDINAL"), field("number", $.number_literal)),
  __procedure_persistent_option: ($) => kw("PERSISTENT"),
  __procedure_thread_safe_option: ($) =>
    seq(kw("THREAD-SAFE"), optional(kw("SAFE"))),
  __procedure_external_phrase: ($) =>
    prec.left(
      seq(
        kw("EXTERNAL"),
        field("library", $._escaped_string),
        optional(choice(kw("CDECL"), kw("PASCAL"), kw("STDCALL"))),
        optional(seq(kw("ORDINAL"), $.number_literal)),
        optional(kw("PERSISTENT")),
        optional(choice(kw("THREAD-SAFE"))),
      ),
    ),
  __procedure_in_super_phrase: ($) => seq(kw("IN"), kw("SUPER")),
  __procedure_map_option: ($) => seq(kw("MAP"), field("name", $.identifier)),
});
