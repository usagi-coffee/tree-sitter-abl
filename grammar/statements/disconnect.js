module.exports = ({ kw, tkw }) => ({
  disconnect_statement: ($) =>
    seq(tkw("DISCONNECT"), $.__disconnect_body, $._terminator),

  __disconnect_body: ($) =>
    seq(
      choice(
        seq(tkw("VALUE"), "(", field("database", $._expression), ")"),
        field("database", $.identifier),
      ),
      optional(tkw("NO-ERROR")),
    ),
});
