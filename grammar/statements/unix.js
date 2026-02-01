module.exports = ({ kw }) => ({
  unix_statement: ($) =>
    seq(
      kw("UNIX"),
      optional(kw("SILENT")),
      repeat(
        choice(
          field("command_token", $.identifier),
          seq(kw("VALUE"), "(", field("command", $._expression), ")"),
        ),
      ),
      $._terminator,
    ),
});
