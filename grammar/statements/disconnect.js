export default ({ kw }) => ({
  disconnect_statement: ($) => seq($.__disconnect_prefix, $._no_error_terminator),

  __disconnect_prefix: ($) =>
    seq(
      kw("DISCONNECT"),
      choice(
        seq(kw("VALUE"), "(", field("database", $._expression), ")"),
        // The reference says of the logical name: "It can be an unquoted string
        // or a quoted string." Only the unquoted form was read, so
        // `IF CONNECTED("c") THEN DISCONNECT "c".` failed on the quoted one --
        // the spelling code uses when the same name is passed to CONNECTED.
        field("database", choice($.identifier, $.string_literal)),
      ),
    ),
});
