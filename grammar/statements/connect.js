module.exports = ({ kw, tkw }) => ({
  connect_statement: ($) =>
    seq(
      tkw("CONNECT"),
      choice(
        seq(tkw("VALUE"), "(", field("value", $._expression), ")"),
        field("database", $._expression),
      ),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
});
