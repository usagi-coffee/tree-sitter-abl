export default ({ kw }) => ({
  create_socket_statement: ($) =>
    seq($.__create_socket_head, field("name", $.identifier), $._no_error_terminator),
  __create_socket_head: ($) => seq($._kw_create, choice(kw("SOCKET"), kw("SERVER-SOCKET"))),
});
