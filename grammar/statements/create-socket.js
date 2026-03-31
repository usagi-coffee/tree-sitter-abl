module.exports = ({ kw }) => ({
  create_socket_statement: ($) => seq(kw("CREATE"), $.__create_socket_body),

  __create_socket_body: ($) =>
    choice(
      seq(kw("SOCKET"), field("name", $.identifier), $._no_error_terminator),
      seq(kw("SERVER-SOCKET"), field("name", $.identifier), $._no_error_terminator),
    ),
});
