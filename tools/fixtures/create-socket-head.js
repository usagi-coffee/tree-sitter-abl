export default ({ kw }) => ({
  create_socket_statement: ($) =>
    seq(
      $._kw_create,
      choice(kw("SOCKET"), kw("SERVER-SOCKET")),
      field("name", $.identifier),
      $._no_error_terminator,
    ),
});
