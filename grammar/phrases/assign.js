export default ({ kw }) => ({
  assign_phrase: ($) => seq(kw("ASSIGN"), $.__assign_body),

  __assign_body: ($) =>
    seq(
      alias($.__assign_pair, $.assign_pair),
      repeat(alias($.__assign_pair, $.assign_pair)),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __assign_pair: ($) =>
    seq(
      field(
        "left",
        choice(
          $._assignable,
          $.__assign_keyword_identifier,
          seq(kw("BROWSE"), field("browse", $.identifier), ":", field("attr", $.identifier)),
        ),
      ),
      optional(seq("=", field("right", choice($.array_initializer, $._expression)))),
      optional($._when_phrase),
    ),
  __assign_keyword_identifier: ($) => alias($._widgets, $.identifier),
});
