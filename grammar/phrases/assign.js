export default ({ kw }) => ({
  assign_phrase: ($) => seq(kw("ASSIGN"), $.__assign_body),

  __assign_body: ($) => seq($._assign_pair_list, optional(alias(kw("NO-ERROR"), $.no_error))),

  _assign_pair_list: ($) =>
    prec.right(seq(alias($.__assign_pair, $.assign_pair), optional($._assign_pair_list))),

  __assign_pair: ($) =>
    seq(
      field(
        "left",
        choice(
          $._assignable,
          $.__assign_keyword_identifier,
          seq(kw("BROWSE"), field("browse", $.__widget_name), ":", field("attr", $.identifier)),
          seq(
            kw("FRAME", { offset: 4 }),
            field("frame", $.__widget_name),
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
        choice("=", field("operator", alias($.__assign_compound_operator, $.assignment_operator))),
        field("right", choice($.array_initializer, $._expression)),
        optional($._when_phrase),
      ),
      $._when_phrase,
    ),
  __assign_compound_operator: ($) => choice("+=", "-=", "*=", "/="),
  __assign_keyword_identifier: ($) => alias($._widgets, $.identifier),
});
