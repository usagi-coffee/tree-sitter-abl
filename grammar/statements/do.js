export default ({ kw }) => ({
  do_statement: ($) => seq($.__do_statement_prefix, $._terminator),

  __do_statement_prefix: ($) => seq(optional($._label), $.__do_body, kw("END")),

  // Widening the FOR branch counter makes record-phrase ambiguities global.
  __do_body: ($) =>
    seq(
      kw("DO"),
      choice(
        seq(
          alias($._for_phrase, $.for_phrase),
          optional($.__do_selection_after_for),
          $.__do_body_tail,
        ),
        seq($.__do_selection_after_for, $.__do_body_tail),
        $.__do_body_tail_wide,
      ),
    ),
  __do_body_tail_wide: ($) =>
    choice(
      seq(
        alias(kw("TRANSACTION", { offset: 5 }), $.transaction),
        optional($.__do_body_after_first_transaction_wide),
      ),
      $.__do_body_after_first_transaction_wide,
    ),
  __do_body_after_first_transaction_wide: ($) =>
    choice(
      seq($.__do_condition_or_loop_phrase_wide, optional($.__do_body_after_condition_or_loop)),
      $.__do_block_tail,
    ),
  __do_condition_or_loop_phrase_wide: ($) =>
    choice(seq($.__do_while_phrase, optional($.__do_loop_phrase)), $.__do_loop_phrase),
  __do_selection_after_for: ($) =>
    choice(seq($.preselect_phrase, optional($.query_tuning_phrase)), $.query_tuning_phrase),
  __do_body_tail: ($) =>
    choice(
      seq(
        alias(kw("TRANSACTION", { offset: 5 }), $.transaction),
        optional($.__do_body_after_first_transaction),
      ),
      $.__do_body_after_first_transaction,
    ),
  __do_body_after_first_transaction: ($) =>
    choice(
      seq($.__do_condition_or_loop_phrase, optional($.__do_body_after_condition_or_loop)),
      $.__do_block_tail,
    ),
  __do_body_after_condition_or_loop: ($) =>
    choice(
      seq(alias(kw("TRANSACTION", { offset: 5 }), $.transaction), optional($.__do_block_tail)),
      seq(alias($.__do_while_phrase, $.while_phrase), optional($.__do_block_tail)),
      $.__do_block_tail,
    ),
  __do_block_tail: ($) =>
    choice(
      seq(
        repeat1($._block_option),
        optional(alias(kw("TRANSACTION", { offset: 5 }), $.transaction)),
        $.body,
      ),
      $.body,
    ),

  body: ($) =>
    prec.right(seq(choice(alias($._colon, ":"), $._terminator_dot), repeat($._statement))),
  __do_condition_or_loop_phrase: ($) =>
    choice(seq($.__do_while_phrase, optional($._loop_phrase)), $._loop_phrase),
  __do_loop_phrase: ($) =>
    seq(
      field(
        "variable",
        choice($.identifier, $.qualified_name, $.array_access, $.macro_concatenated_name),
      ),
      "=",
      field("start", $._expression),
      kw("TO"),
      field("end", $._expression),
      optional(seq(kw("BY"), field("step", $._expression))),
    ),
  __do_while_phrase: ($) => seq(kw("WHILE"), field("condition", $._expression)),
});
