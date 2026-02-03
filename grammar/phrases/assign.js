module.exports = ({ kw }) => ({
  assign_phrase: ($) => seq(kw("ASSIGN"), $.__assign_body),

  __assign_body: ($) =>
    seq(
      alias($.__assign_pair, $.assign_pair),
      repeat(alias($.__assign_pair, $.assign_pair)),
      optional(alias($.__assign_no_error, $.no_error)),
    ),

  __assign_pair: ($) =>
    seq(
      field("left", choice($._assignable, $.__assign_keyword_identifier)),
      optional(
        seq("=", field("right", choice($.array_initializer, $._expression))),
      ),
      optional(
        alias($.__assign_when_available_phrase, $.when_available_phrase),
      ),
    ),

  __assign_body: ($) =>
    seq(
      alias($.__assign_pair, $.assign_pair),
      repeat(alias($.__assign_pair, $.assign_pair)),
      optional(alias($.__assign_no_error, $.no_error)),
    ),

  __assign_pair: ($) =>
    seq(
      field("left", choice($._assignable, $.__assign_keyword_identifier)),
      optional(
        seq("=", field("right", choice($.array_initializer, $._expression))),
      ),
      optional(
        alias($.__assign_when_available_phrase, $.when_available_phrase),
      ),
    ),
  __assign_keyword_identifier: ($) => alias($._widgets, $.identifier),

  __assign_no_error: ($) => kw("NO-ERROR"),
});
