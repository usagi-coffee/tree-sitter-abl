module.exports = ({ kw, tkw }) => ({
  disconnect_statement: ($) =>
    seq(
      tkw("DISCONNECT"),
      choice(
        seq(tkw("VALUE"), "(", field("database", $._expression), ")"),
        field("database", $.identifier),
      ),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
});
