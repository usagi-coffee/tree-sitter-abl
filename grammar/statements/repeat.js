module.exports = ({ kw }) => ({
  repeat_statement: ($) =>
    seq(optional($._label), $.__repeat_body, kw("END"), $._terminator),

  __repeat_body: ($) =>
    seq(
      kw("REPEAT"),
      optional(seq(kw("FOR"), $.__repeat_records)),
      optional($.preselect_phrase),
      optional($.query_tuning_phrase),
      optional($.__repeat_loop_phrase),
      optional(choice($.__repeat_while_phrase, $.__repeat_until_phrase)),
      optional(kw("TRANSACTION")),
      repeat(
        choice(
          $.stop_after_phrase,
          $.on_endkey_phrase,
          $.on_stop_phrase,
          $.on_error_phrase,
          $.on_quit_phrase,
          $.frame_phrase,
        ),
      ),
      $.body,
    ),

  __repeat_records: ($) =>
    seq(
      field("record", $.__repeat_record),
      repeat(seq(",", field("record", $.__repeat_record))),
    ),
  __repeat_record: ($) => $._identifier_or_qualified_name,
  __repeat_break_by_phrase: ($) =>
    prec.right(
      seq(
        optional(kw("BREAK")),
        kw("BY"),
        $._expression,
        optional($.__repeat_sort_direction),
        repeat(
          seq(kw("BY"), $._expression, optional($.__repeat_sort_direction)),
        ),
      ),
    ),
  __repeat_loop_phrase: ($) =>
    seq(
      field("variable", $.identifier),
      "=",
      field("start", $._expression),
      kw("TO"),
      field("end", $._expression),
      optional(seq(kw("BY"), field("step", $._expression))),
    ),
  __repeat_while_phrase: ($) =>
    seq(kw("WHILE"), field("condition", $._expression)),
  __repeat_until_phrase: ($) =>
    seq(kw("UNTIL"), field("condition", $._expression)),
  __repeat_sort_direction: ($) => kw("DESCENDING", { offset: 4 }),
  __repeat_undo_phrase: ($) =>
    seq(
      kw("UNDO"),
      ",",
      choice(
        seq(kw("RETURN"), kw("ERROR"), $.string_literal),
        kw("THROW"),
        kw("LEAVE"),
        kw("NEXT"),
        kw("RETRY"),
        seq(kw("RETURN"), kw("NO-APPLY")),
        seq(kw("RETURN"), $.string_literal),
      ),
    ),
  __repeat_undo_throw_phrase: ($) => seq(kw("UNDO"), ",", kw("THROW")),
  __repeat_undo_return_error: ($) =>
    seq(kw("UNDO"), ",", kw("RETURN"), kw("ERROR"), $.new_expression),
});
