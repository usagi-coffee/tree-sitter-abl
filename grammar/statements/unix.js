module.exports = ({ kw, tkw }) => ({
  unix_statement: ($) =>
    seq(
      tkw("UNIX"),
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
