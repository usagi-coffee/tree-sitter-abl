export default ({ kw }) => ({
  close_query_statement: ($) => seq($._kw_close, $._query_name_phrase, $._terminator),
});
