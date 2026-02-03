module.exports = ({ kw }) => ({
  create_socket_statement: ($) =>
    seq(kw("CREATE"), $.__create_socket_body, $._terminator),

  __create_socket_body: ($) =>
    choice(
      seq(kw("SOCKET"), field("name", $.identifier), optional(kw("NO-ERROR"))),
      seq(
        kw("SERVER-SOCKET"),
        field("name", $.identifier),
        optional(kw("NO-ERROR")),
      ),
    ),
});
