module.exports = ({ kw, tkw }) => ({
  create_socket_statement: ($) =>
    seq(kw("CREATE"), kw("SOCKET"), field("name", $.identifier), optional(tkw("NO-ERROR")), $._terminator),
});
