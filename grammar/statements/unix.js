module.exports = ({ kw, tkw }) => ({
  unix_statement: ($) =>
    seq(
      tkw("UNIX"),
      optional(choice(tkw("SILENT"), tkw("NOWAIT"))),
      optional(seq(tkw("VALUE"), "(", field("command", $._expression), ")")),
      $._terminator,
    ),
});
