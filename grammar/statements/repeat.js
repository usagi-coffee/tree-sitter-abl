module.exports = ({ kw }) => ({
  repeat_statement: ($) =>
    seq(optional($._label), $.__repeat_body, kw("END"), $._terminator),

  __repeat_body: ($) =>
    seq(
      kw("REPEAT"),
      optional(
        seq(
          kw("FOR"),
          seq(
            field("record", $._identifier_or_qualified_name),
            repeat(seq(",", field("record", $._identifier_or_qualified_name))),
          ),
        ),
      ),
      optional($.preselect_phrase),
      optional($.query_tuning_phrase),
      optional($.__repeat_loop_phrase),
      optional(choice($.__repeat_while_phrase, $.__repeat_until_phrase)),
      optional(alias(kw("TRANSACTION"), $.transaction)),
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

  __repeat_break_by_phrase: ($) =>
    prec.right(
      seq(
        optional(alias(kw("BREAK"), $.break)),
        kw("BY"),
        field("by", $._expression),
        optional($.__repeat_sort_direction),
        repeat(
          seq(
            kw("BY"),
            field("by", $._expression),
            optional($.__repeat_sort_direction),
          ),
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
  __repeat_sort_direction: ($) =>
    field("sort_order", kw("DESCENDING", { offset: 4 })),
});
