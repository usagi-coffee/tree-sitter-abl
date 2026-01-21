module.exports = ({ kw, tkw }) => ({
  catch_statement: ($) =>
    seq(
      kw("CATCH"),
      field("name", $.identifier),
      optional(seq(kw("AS"), field("type", $.qualified_name))),
      $.body,
      tkw("END"),
      $._terminator,
    ),
});
