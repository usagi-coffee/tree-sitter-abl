module.exports = ({ kw }) => ({
  create_socket_statement: ($) => seq(kw("CREATE"), $.__create_socket_body),

  __create_socket_body: ($) =>
    seq(
      choice(kw("SOCKET"), kw("SERVER-SOCKET")),
      field("name", $.identifier),
      $._no_error_terminator,
    ),
});
