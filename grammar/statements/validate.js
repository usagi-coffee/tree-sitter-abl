module.exports = ({ kw }) => ({
  validate_statement: ($) =>
    seq(kw("VALIDATE"), $.__validate_body, $._terminator),

  __validate_body: ($) =>
    seq(
      field("record", choice($.identifier, $.qualified_name)),
      optional(kw("NO-ERROR")),
    ),
});
