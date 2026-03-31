module.exports = ({ kw }) => ({
  disconnect_statement: ($) => seq(kw("DISCONNECT"), $.__disconnect_body, $._no_error_terminator),

  __disconnect_body: ($) =>
    seq(
      choice(
        seq(kw("VALUE"), "(", field("database", $._expression), ")"),
        field("database", $.identifier),
      ),
    ),
});
