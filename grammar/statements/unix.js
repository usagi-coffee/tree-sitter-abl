module.exports = ({ kw }) => ({
  unix_statement: ($) =>
    seq(
      kw("UNIX"),
      optional(alias(kw("SILENT"), $.silent)),
      repeat(
        choice(
          field("command_token", $.identifier),
          seq(kw("VALUE"), "(", field("command", $._expression), ")"),
        ),
      ),
      $._terminator,
    ),
});
