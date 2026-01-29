module.exports = ({ kw, tkw }) => ({
  close_query_statement: ($) =>
    seq(tkw("CLOSE"), $.__close_query_body, $._terminator),

  __close_query_body: ($) => seq(kw("QUERY"), field("query", $.identifier)),
});
