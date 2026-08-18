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
            kw("FRAME", { offset: 4 }),
            field("frame", $.__assign_widget_name),
            ":",
            field("attr", $.identifier),
          ),
        ),
      ),
      optional($.__assign_pair_tail),
    ),
  // `ASSIGN x += 1 y = 2.` -- a compound assignment is legal inside an ASSIGN
  // list, not only as a statement on its own, and only `=` was read here.
  //
  // `=` stays anonymous so every existing tree is unchanged; the compound
  // forms carry an operator node, because otherwise nothing in the tree would
  // tell `+=` from `=`.
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
  // Generated screens reach their frame through a macro, as in
  // `FRAME {&FRAME-NAME}:HIDDEN = YES`, so the name can be either.
  __assign_widget_name: ($) => choice($.identifier, $.preprocessor_name),
});
