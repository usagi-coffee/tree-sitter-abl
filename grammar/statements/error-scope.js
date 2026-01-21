module.exports = ({ kw, tkw }) => ({
  block_level_on_error_statement: ($) =>
    seq(
      token(/BLOCK-LEVEL/i),
      kw("ON"),
      kw("ERROR"),
      tkw("UNDO"),
      ",",
      tkw("THROW"),
      $._terminator,
    ),

  routine_level_on_error_statement: ($) =>
    seq(
      token(/ROUTINE-LEVEL/i),
      kw("ON"),
      kw("ERROR"),
      tkw("UNDO"),
      ",",
      tkw("THROW"),
      $._terminator,
    ),
});
