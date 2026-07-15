export default ({ kw }) => ({
  for_statement: ($) => seq($.__for_statement_prefix, $._terminator),

  __for_statement_prefix: ($) => seq(optional($._label), $.__for_body, kw("END")),

  __for_body: ($) =>
    seq(
      kw("FOR"),
      $.__for_record_or_variables,
      optional(alias($.__for_while_phrase, $.while_phrase)),
      optional(alias(kw("TRANSACTION"), $.transaction)),
      repeat($._block_option),
      optional($.__for_with_stream_io_phrase),
      $.body,
    ),
  __for_record_or_variables: ($) => choice($.__for_record_phrase_section, $.__for_variables),
  __for_record_phrase_section: ($) =>
    seq($.__for_record_phrases, repeat($.__for_break_or_sort_phrase)),

  __for_record_phrases: ($) => seq($.__for_record, repeat(seq(",", $.__for_record))),

  __for_record: ($) => seq(optional(choice(kw("EACH"), kw("FIRST"), kw("LAST"))), $.record_phrase),

  __for_break_or_sort_phrase: ($) =>
    choice(
      alias($.__for_by_phrase, $.by_phrase),
      alias($.__for_group_by_phrase, $.group_by_phrase),
      alias($.__for_collate_phrase, $.collate_phrase),
      alias($.__for_break_by, $.break_by),
    ),

  __for_variables: ($) => $._loop_phrase,

  __for_by_phrase: ($) => prec.right(seq(kw("BY"), $.__for_by_tail)),
  __for_group_by_phrase: ($) => prec.right(seq(kw("GROUP"), kw("BY"), $.__for_by_tail)),

  __for_break_by: ($) => prec.right(seq(kw("BREAK"), kw("BY"), $.__for_by_tail)),

  __for_with_stream_io_phrase: ($) => seq(kw("WITH"), alias(kw("STREAM-IO"), $.stream_io)),

  __for_by_tail: ($) =>
    prec.right(
      seq(
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

  __for_collate_phrase: ($) =>
    seq($._collate_body, optional(field("sort_order", kw("DESCENDING", { offset: 4 })))),
  __for_while_phrase: ($) => seq(kw("WHILE"), field("condition", $._expression)),
});
