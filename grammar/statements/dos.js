module.exports = ({ kw }) => ({
  dos_statement: ($) =>
    seq(
      kw("DOS"),
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
