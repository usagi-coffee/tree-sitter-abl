module.exports = ({ kw, tkw }) => ({
  block_level_on_error_statement: ($) =>
    seq(
      tkw("BLOCK-LEVEL"),
      kw("ON"),
      kw("ERROR"),
      tkw("UNDO"),
      ",",
      tkw("THROW"),
      $._terminator,
    ),
  routine_level_on_error_statement: ($) =>
    seq(
      tkw("ROUTINE-LEVEL"),
      kw("ON"),
      kw("ERROR"),
      tkw("UNDO"),
      ",",
      tkw("THROW"),
      $._terminator,
    ),
});
