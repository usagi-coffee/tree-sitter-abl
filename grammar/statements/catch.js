module.exports = ({ kw, tkw }) => ({
  catch_statement: ($) => seq(kw("CATCH"), $.__catch_body, $._terminator),

  __catch_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(
        seq(kw("AS"), optional(kw("CLASS")), field("type", $.qualified_name)),
      ),
      $.body,
      tkw("END"),
      optional(tkw("CATCH")),
    ),
});
