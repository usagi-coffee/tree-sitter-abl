module.exports = ({ kw }) => ({
  validate_statement: ($) =>
    seq(
      kw("VALIDATE"),
      field("record", choice($.identifier, $.qualified_name)),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),
});
