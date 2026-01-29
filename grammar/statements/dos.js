module.exports = ({ kw, tkw }) => ({
  dos_statement: ($) =>
    seq(
      tkw("DOS"),
      optional(tkw("SILENT")),
      repeat(
        choice(
          field("command_token", $.identifier),
          seq(tkw("VALUE"), "(", field("command", $._expression), ")"),
        ),
      ),
      $._terminator,
    ),
});
