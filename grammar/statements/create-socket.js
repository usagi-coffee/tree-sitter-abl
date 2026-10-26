export default ({ kw }) => ({
  create_socket_statement: ($) =>
    seq($.__create_socket_head, field("name", $.identifier), $._no_error_terminator),
  // Keeping this keyword head separate reduces action-table size.
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice-sequence
  __create_socket_head: ($) => seq($._kw_create, choice(kw("SOCKET"), kw("SERVER-SOCKET"))),
});
