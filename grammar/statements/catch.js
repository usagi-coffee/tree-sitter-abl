module.exports = ({ kw }) => ({
  catch_statement: ($) => seq(kw("CATCH"), $.__catch_body, $._terminator),

  __catch_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(
        seq(kw("AS"), optional(kw("CLASS")), field("type", $.qualified_name)),
      ),
      $.body,
      kw("END"),
      optional(kw("CATCH")),
    ),
});
