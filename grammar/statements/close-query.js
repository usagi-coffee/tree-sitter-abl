module.exports = ({ kw, tkw }) => ({
  close_query_statement: ($) =>
    seq(
      tkw("CLOSE"),
      kw("QUERY"),
      field("query", $.identifier),
      $._terminator,
    ),
});
