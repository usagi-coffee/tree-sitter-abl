export default ({ kw }) => ({
  error_scope_statement: ($) =>
    seq(
      alias($.__error_scope_type, $.error_scope_type),
      alias($.__error_scope_on_error_phrase, $.on_error_phrase),
      $._terminator,
    ),

  __error_scope_type: ($) => choice(kw("BLOCK-LEVEL"), kw("ROUTINE-LEVEL")),
  __error_scope_on_error_phrase: ($) =>
    seq($._on_keyword, kw("ERROR"), kw("UNDO"), ",", kw("THROW")),
});
