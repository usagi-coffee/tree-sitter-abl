export default ({ kw }) => ({
  procedure_definition: ($) => seq($.__procedure_header, alias($.__procedure_body, $.body)),

  __procedure_header: ($) =>
    seq(
      kw("PROCEDURE", { offset: 4 }),
      optional($.__procedure_modifier),
      field(
        "name",
        choice(
          $._identifier_or_qualified_name,
          alias($.__symbolic_routine_name, $.identifier),
          alias($.__numeric_routine_name, $.identifier),
          // `PROCEDURE -REPORT :` compiles. Kept as its own token rather than
          // added to the symbolic routine name, which is also read at the head
          // of a call, where a leading `-` is subtraction. A letter is required
          // straight after the dash so the token can never be a negative
          // number, and it is wired only here.
          alias($.__procedure_dash_name, $.identifier),
        ),
      ),
      optional($.__procedure_modifier),
      repeat(
        choice(
          alias(kw("CDECL"), $.cdecl),
          seq(kw("ORDINAL"), field("ordinal", $.number_literal)),
          alias(kw("PERSISTENT"), $.persistent),
          alias(seq(kw("THREAD-SAFE"), optional(kw("SAFE"))), $.thread_safe),
          alias($.__procedure_external_phrase, $.external_phrase),
          seq(kw("MAP"), field("name", $.identifier)),
        ),
      ),
      optional(alias($.__procedure_in_super_phrase, $.in_super_phrase)),
    ),

  __procedure_body: ($) =>
    seq($.__procedure_compound_body, optional(kw("PROCEDURE", { offset: 4 })), $._terminator),
  __procedure_compound_body: ($) =>
    seq(
      choice(alias($._colon, ":"), alias($._terminator_dot, ".")),
      repeat($._statement),
      kw("END"),
    ),

  __procedure_dash_name: ($) => token(/-[\p{L}][\p{L}\p{N}_\-&#%$!]*/i),

  __procedure_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
    ),
  __procedure_in_super_phrase: ($) => seq(kw("IN"), kw("SUPER")),

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
        optional(seq(kw("ORDINAL"), field("ordinal", $.number_literal))),
        optional(alias(kw("PERSISTENT"), $.persistent)),
        optional(alias(kw("THREAD-SAFE"), $.thread_safe)),
      ),
    ),
});
