export default ({ kw }) => ({
  close_query_statement: ($) => seq($._close_keyword, $.__close_query_body, $._terminator),

  __close_query_body: ($) => seq(kw("QUERY"), field("query", $.identifier)),
});
