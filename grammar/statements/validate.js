module.exports = ({ kw, tkw }) => ({
  validate_statement: ($) =>
    seq(
      tkw("VALIDATE"),
      field("record", choice($.identifier, $.qualified_name)),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
});
