module.exports = ({ kw, tkw }) => ({
  catch_statement: ($) =>
    seq(
      kw("CATCH"),
      field("name", $.identifier),
      optional(seq(kw("AS"), optional(kw("CLASS")), field("type", $.qualified_name))),
      $.body,
      tkw("END"),
      optional(tkw("CATCH")),
      $._terminator,
    ),
});
