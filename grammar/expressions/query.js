module.exports = ({ kw, tkw }) => ({
  query_access: ($) =>
    seq(
      kw("QUERY"),
      field("query", $.identifier),
      ":",
      field("attribute", $.identifier),
    ),
});
