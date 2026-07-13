export default ({ kw }) => ({
  return_statement: ($) => seq($.__return_prefix, $._terminator),

  __return_prefix: ($) => seq(kw("RETURN"), optional($.__return_body)),
  __return_body: ($) =>
    choice(
      field("value", $._expression),
      seq(kw("ERROR"), optional(field("error_value", $._expression))),
      alias(kw("NO-APPLY"), $.no_apply),
    ),
});
