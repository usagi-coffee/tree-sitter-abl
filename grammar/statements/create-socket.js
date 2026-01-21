module.exports = ({ kw }) => ({
  create_socket_statement: ($) =>
    seq(kw("CREATE"), kw("SOCKET"), field("name", $.identifier), $._terminator),
});
