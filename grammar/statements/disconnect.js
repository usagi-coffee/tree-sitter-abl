export default ({ kw }) => ({
  disconnect_statement: ($) => seq($.__disconnect_prefix, $._no_error_terminator),

  __disconnect_prefix: ($) =>
    seq(
      kw("DISCONNECT"),
      choice(
        seq(kw("VALUE"), "(", field("database", $._expression), ")"),
        field("database", choice($.identifier, $.string_literal)),
      ),
    ),
});
