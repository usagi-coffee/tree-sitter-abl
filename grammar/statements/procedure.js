module.exports = ({ kw, tkw }) => ({
  procedure_definition: ($) =>
    seq(
      kw("PROCEDURE"),
      optional(alias($.__procedure_access_modifier, $.access_modifier)),
      field("name", $.identifier),
      repeat($.__procedure_option),
      optional(alias($.__procedure_external_phrase, $.external_phrase)),
      $._colon,
      repeat($._statement),
      tkw("END"),
      optional(tkw("PROCEDURE")),
      $._terminator,
    ),

  __procedure_access_modifier: ($) =>
    choice(kw("PRIVATE"), kw("PROTECTED"), kw("PUBLIC")),

  __procedure_option: ($) =>
    choice(
      alias($.__procedure_cdecl_option, $.cdecl_option),
      alias($.__procedure_ordinal_option, $.ordinal_option),
      alias($.__procedure_persistent_option, $.persistent_option),
      alias($.__procedure_thread_safe_option, $.thread_safe_option),
    ),

  __procedure_cdecl_option: ($) => tkw("CDECL"),
  __procedure_ordinal_option: ($) => seq(tkw("ORDINAL"), $.number_literal),
  __procedure_persistent_option: ($) => tkw("PERSISTENT"),
  __procedure_thread_safe_option: ($) => tkw("THREAD-SAFE"),
  __procedure_external_phrase: ($) => seq(tkw("EXTERNAL"), field("library", $.string_literal)),

  procedure_forward_definition: ($) =>
    seq(
      kw("PROCEDURE"),
      field("name", $.identifier),
      optional(alias($.__procedure_in_super_phrase, $.in_super_phrase)),
      $._terminator,
    ),

  __procedure_in_super_phrase: ($) => seq(kw("IN"), tkw("SUPER")),
});
