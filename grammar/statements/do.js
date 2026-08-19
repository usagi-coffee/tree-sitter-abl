export default ({ kw }) => ({
  do_statement: ($) => seq($.__do_statement_prefix, $._terminator),

  __do_statement_prefix: ($) => seq(optional($._label), $.__do_body, kw("END")),

  // The FOR phrase and the counter are split into two branches, rather than the
  // FOR phrase being one optional in front of a single tail.
  //
  // A counter that extends a bare name -- `DO tt.idx = 1 TO 10:`,
  // `DO cpt[n] = 1 TO 10:` -- is legal, and so is `DO FOR tt i = 1 TO 10:`. Put
  // together in one branch they are not separable: after `DO FOR tt` the parser
  // cannot tell a finished record name from the head of a qualified counter
  // until the `=`. Declaring that conflict was measured and does not stop at
  // one -- it surfaces `function_call` on the opening parenthesis, then
  // `__record_field_list`, each on a path every record phrase reaches.
  //
  // Split, no conflict arises at all: the branch with a record keeps the bare
  // counter, the branch without takes the wide one. The cost is the duplicated
  // tail below. `DO FOR tt tt.idx = 1 TO 10:` is the one form given up, and it
  // is not a form anything writes.
  __do_body: ($) =>
    seq(
      kw("DO"),
      choice(
        seq(
          alias($._for_phrase, $.for_phrase),
          optional($.__do_selection_after_for),
          $.__do_body_tail,
        ),
        // PRESELECT and QUERY-TUNING carry record phrases of their own, so this
        // branch keeps the bare counter for the same reason the FOR one does.
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
  // `_assignable` is deliberately not used, though the compiler would allow it:
  // it reaches a call and a widget-qualified name, neither of which is ever
  // written as a counter, so it would widen the rule for nothing.
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
