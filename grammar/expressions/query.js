module.exports = ({ kw, tkw }) => ({
  query_expression: ($) =>
    seq(
      kw("QUERY"),
      field("query", $.identifier),
      ":",
      field("attribute", $.identifier),
    ),
});
