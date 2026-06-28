module.exports = ({ kw }) => ({
  disconnect_statement: ($) => seq($.__disconnect_prefix, $._no_error_terminator),

  __disconnect_prefix: ($) => seq(kw("DISCONNECT"), $.__disconnect_body),
  __disconnect_body: ($) =>
    seq(
      choice(
        seq(kw("VALUE"), "(", field("database", $._expression), ")"),
        field("database", $.identifier),
      ),
    ),
});
