export default ({ kw }) => ({
  can_find_expression: ($) => seq($.__can_find_body, ")"),

  __can_find_body: ($) =>
    seq(
      kw("CAN-FIND"),
      "(",
      prec.right(
        seq(
          optional(choice(kw("FIRST"), kw("LAST"))),
          field("table", $._identifier_or_qualified_name),
          optional($.__record_query_options),
        ),
      ),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __record_query_options: ($) =>
    choice(seq($.of_phrase, optional($.__record_query_after_of)), $.__record_query_after_of),
  __record_query_after_of: ($) =>
    choice(
      seq(
        alias($.__record_query_using_phrase, $.using_phrase),
        optional($.__record_query_after_using),
      ),
      $.__record_query_after_using,
    ),
  __record_query_after_using: ($) =>
    choice(
      seq(
        alias($.__record_query_frame_phrase, $.frame_phrase),
        optional($.__record_query_after_frame),
      ),
      $.__record_query_after_frame,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __record_query_after_frame: ($) =>
    choice(
      choice(
        seq(
          alias($.__record_query_where_phrase, $.where_phrase),
          choice(
            seq(
              optional(alias($.__record_query_lock_phrase, $.no_lock)),
              optional($.__record_query_use_index),
            ),
            seq(
              $.__record_query_use_index,
              optional(alias($.__record_query_lock_phrase, $.no_lock)),
            ),
          ),
        ),
        // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
        seq(
          alias($.__record_query_lock_phrase, $.no_lock),
          // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
          optional(alias($.__record_query_where_phrase, $.where_phrase)),
          optional($.__record_query_use_index),
        ),
      ),
      $.__record_query_use_index,
    ),

  __record_query_where_phrase: ($) => seq(kw("WHERE"), optional($._expression)),
  __record_query_using_phrase: ($) =>
    seq($._using_keyword, field("index", $._identifier_or_qualified_name)),
  __record_query_frame_phrase: ($) =>
    seq(
      kw("AND"),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("FRAME", { offset: 4 }),
      optional(field("frame", $.identifier)),
      field("field", $.identifier),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/keyword-reuse
  __record_query_lock_phrase: ($) => kw("NO-LOCK"),
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
  __record_query_use_index: ($) =>
    seq(kw("USE-INDEX"), field("index", $._identifier_or_qualified_name)),
});
