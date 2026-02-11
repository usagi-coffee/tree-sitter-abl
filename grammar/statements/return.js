module.exports = ({ kw }) => ({
  return_statement: ($) =>
    seq(
      kw("RETURN"),
      optional(
        choice(
          field("value", $._expression),
          seq(kw("ERROR"), optional(field("error_value", $._expression))),
          alias(kw("NO-APPLY"), $.no_apply),
        ),
      ),
      $._terminator,
    ),
});
