module.exports = ({ kw }) => ({
  use_statement: ($) => seq(kw("USE"), $.__use_body, $._terminator),

  __use_body: ($) =>
    seq(
      field("environment", $._expression),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),
});
