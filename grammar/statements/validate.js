module.exports = ({ kw }) => ({
  validate_statement: ($) =>
    seq(kw("VALIDATE"), $.__validate_body, $._terminator),

  __validate_body: ($) =>
    seq(
      field("record", $._identifier_or_qualified_name),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),
});
