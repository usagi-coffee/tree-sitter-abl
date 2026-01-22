module.exports = ({ kw, tkw }) => ({
  dos_statement: ($) =>
    seq(
      tkw("DOS"),
      optional(choice(tkw("SILENT"), tkw("NOWAIT"))),
      optional(seq(tkw("VALUE"), "(", field("command", $._expression), ")")),
      $._terminator,
    ),
});
