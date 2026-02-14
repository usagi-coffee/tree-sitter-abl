module.exports = ({ kw }) => ({
  for_statement: ($) =>
    seq(optional($._label), $.__for_body, kw("END"), $._terminator),

  __for_body: ($) =>
    seq(
      kw("FOR"),
      choice($.__for_record_phrase_section, $.__for_variables),
      optional(alias($.__for_while_phrase, $.while_phrase)),
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
      optional($.__for_with_stream_io_phrase),
      $.body,
    ),
  __for_record_phrase_section: ($) =>
    seq(
      $.__for_record_phrases,
      repeat($.__for_break_or_sort_phrase),
    ),

  __for_record_phrases: ($) =>
    seq(
      $.__for_record,
      repeat(seq(",", $.__for_record)),
    ),

  __for_record: ($) =>
    seq(
      optional(choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
      $.record_phrase,
    ),

  __for_break_or_sort_phrase: ($) =>
    choice(
      alias($.__for_by_phrase, $.by_phrase),
      alias($.__for_group_by_phrase, $.group_by_phrase),
      alias($.__for_collate_phrase, $.collate_phrase),
      alias($.__for_break_by, $.break_by),
    ),

  __for_variables: ($) =>
    seq(
      field("variable", $.identifier),
      "=",
      field("start", $._expression),
      kw("TO"),
      field("end", $._expression),
      optional(seq(kw("BY"), field("step", $._expression))),
    ),

  __for_by_phrase: ($) =>
    prec.right(
      seq(
        kw("BY"),
        field("by", $._expression),
        optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
        repeat(
          seq(
            kw("BY"),
            field("by", $._expression),
            optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
          ),
        ),
      ),
    ),
  __for_group_by_phrase: ($) =>
    prec.right(
      seq(
        kw("GROUP"),
        kw("BY"),
        field("by", $._expression),
        optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
        repeat(
          seq(
            kw("BY"),
            field("by", $._expression),
            optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
          ),
        ),
      ),
    ),

  __for_break_by: ($) =>
    prec.right(
      seq(
        kw("BREAK"),
        kw("BY"),
        field("by", $._expression),
        optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
        repeat(
          seq(
            kw("BY"),
            field("by", $._expression),
            optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
          ),
        ),
      ),
    ),

  __for_with_stream_io_phrase: ($) =>
    seq(kw("WITH"), alias(kw("STREAM-IO"), $.stream_io)),

  __for_collate_phrase: ($) =>
    seq(
      kw("COLLATE"),
      "(",
      field("string", $._expression),
      ",",
      field("strength", $._expression),
      optional(seq(",", field("collation", $._expression))),
      ")",
      optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
    ),

  __for_while_phrase: ($) =>
    seq(kw("WHILE"), field("condition", $._expression)),
});
