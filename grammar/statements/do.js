export default ({ kw }) => ({
  do_statement: ($) => seq($.__do_statement_prefix, $._terminator),

  __do_statement_prefix: ($) => seq(optional($._label), $.__do_body, kw("END")),

  __do_body: ($) =>
    seq(
      kw("DO"),
      optional(alias($._for_phrase, $.for_phrase)),
      optional($.__do_selection_after_for),
      $.__do_body_tail,
    ),
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
  // The reference lists TRANSACTION before the frame phrase, but the compiler
  // takes the reverse order and AppBuilder writes it that way:
  // `DO WITH FRAME {&FRAME-NAME} TRANSACTION:`.
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
  // `DO WHILE h:LOCKED ii = 1 TO 5 :` compiles: a counter may follow the
  // condition. Hung off the WHILE branch rather than added to the tail below,
  // which would also let one counter follow another.
  __do_condition_or_loop_phrase: ($) =>
    choice(seq($.__do_while_phrase, optional($._loop_phrase)), $._loop_phrase),
  __do_while_phrase: ($) => seq(kw("WHILE"), field("condition", $._expression)),
});
