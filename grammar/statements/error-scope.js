module.exports = ({ kw, tkw }) => ({
  error_scope_statement: ($) =>
    seq(
      alias($.__error_scope_type, $.error_scope_type),
      alias($.__error_scope_on_error_phrase, $.on_error_phrase),
      $._terminator,
    ),

  __error_scope_type: ($) => choice(tkw("BLOCK-LEVEL"), tkw("ROUTINE-LEVEL")),
  __error_scope_on_error_phrase: ($) =>
    seq(kw("ON"), kw("ERROR"), tkw("UNDO"), ",", tkw("THROW")),
});
