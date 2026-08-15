export default ({ kw }) => ({
  assign_phrase: ($) => seq(kw("ASSIGN"), $.__assign_body),

  __assign_body: ($) => seq($._assign_pairs, optional(alias(kw("NO-ERROR"), $.no_error))),

  _assign_pairs: ($) => repeat1(alias($.__assign_pair, $.assign_pair)),

  __assign_pair: ($) =>
    seq(
      field(
        "left",
        choice(
          $._assignable,
          $.__assign_keyword_identifier,
          seq(
            kw("BROWSE"),
            field("browse", $.__assign_widget_name),
            ":",
            field("attr", $.identifier),
          ),
          seq(
            kw("FRAME"),
            field("frame", $.__assign_widget_name),
            ":",
            field("attr", $.identifier),
          ),
        ),
      ),
      optional($.__assign_pair_tail),
    ),
  __assign_pair_tail: ($) =>
    choice(
      seq(
        "=",
        field("right", choice($.array_initializer, $._expression)),
        optional($._when_phrase),
      ),
      $._when_phrase,
    ),
  __assign_keyword_identifier: ($) => alias($._widgets, $.identifier),
  // Generated screens reach their frame through a macro, as in
  // `FRAME {&FRAME-NAME}:HIDDEN = YES`, so the name can be either.
  __assign_widget_name: ($) => choice($.identifier, $.preprocessor_name),
});
