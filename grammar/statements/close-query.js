module.exports = ({ kw }) => ({
  close_query_statement: ($) =>
    seq(kw("CLOSE"), $.__close_query_body, $._terminator),

  __close_query_body: ($) => seq(kw("QUERY"), field("query", $.identifier)),
});
