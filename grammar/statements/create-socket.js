module.exports = ({ kw }) => ({
  create_socket_statement: ($) =>
    seq(
      kw("CREATE"),
      choice(kw("SOCKET"), kw("SERVER-SOCKET")),
      field("name", $.identifier),
      $._no_error_terminator,
    ),
});
