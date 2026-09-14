export default ({ kw }) => ({
  close_query_statement: ($) => seq($._close_keyword, $._query_name_phrase, $._terminator),
});
