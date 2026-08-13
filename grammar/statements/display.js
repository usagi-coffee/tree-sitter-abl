export default ({ kw }) => ({
  display_statement: ($) =>
    prec.left(
      seq(
        kw("DISPLAY", { offset: 4 }),
        choice($.__display_browse_body, $.__display_fields_body, $._terminator),
      ),
    ),

  __display_fields_body: ($) =>
    seq(
      choice(
        $.__display_frame_phrases,
        seq($._stream_phrase, $.__display_stream_frame_tail),
        seq(
          optional($.__display_stream_unless_prefix),
          $.__display_items,
          optional($.__display_window_frame_tail),
        ),
      ),
      $._no_error_terminator,
    ),
  __display_stream_frame_tail: ($) =>
    choice(
      seq(alias(kw("UNLESS-HIDDEN"), $.unless_hidden), $.__display_window_frame_phrases),
      $.__display_window_frame_phrases,
    ),
  __display_stream_unless_prefix: ($) =>
    choice(
      seq($._stream_phrase, optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden))),
      alias(kw("UNLESS-HIDDEN"), $.unless_hidden),
    ),
  __display_window_frame_tail: ($) =>
    choice(seq($.in_window_phrase, optional($.__display_frame_phrases)), $.__display_frame_phrases),
  __display_window_frame_phrases: ($) =>
    choice(seq($.in_window_phrase, $.__display_frame_phrases), $.__display_frame_phrases),

  __display_items: ($) =>
    choice(
      seq(
        field("record", $.__display_record),
        optional(seq(kw("EXCEPT"), repeat1(field("except", $._identifier_or_qualified_name)))),
      ),
      prec.right(
        repeat1(
          choice(
            seq(
              $.__display_formatted_field,
              optional($.__display_when_phrase),
              optional(seq("@", field("base", $._identifier_or_qualified_name))),
            ),
            seq(
              $.__display_formatted_field,
              seq("@", field("base", $._identifier_or_qualified_name)),
              $.format_phrase,
              optional($.__display_when_phrase),
            ),
            alias($.__display_aggregate_expression, $.aggregate_expression),
            $.__display_skip_phrase,
            $.__display_space_phrase,
          ),
        ),
      ),
    ),
  __display_when_phrase: ($) => seq(kw("WHEN"), field("when", $.__display_when_expression)),
  __display_when_expression: ($) => $._expression,
  __display_formatted_field: ($) =>
    seq(alias($.__display_field, $.field), optional($.format_phrase)),

  __display_field: ($) =>
    prec.right(
      seq(
        field("field", $.__display_aggregate_primary_expression),
        optional(prec.dynamic(1, $.__display_aggregate_expression)),
      ),
    ),
  __display_aggregate_expression: ($) => seq("(", repeat1($.aggregate_phrase), ")"),
  __display_aggregate_primary_expression: ($) =>
    choice($.__display_keyword_identifier, $._expression),
  __display_keyword_identifier: ($) => alias(kw("MENU"), $.identifier),
  __display_record: ($) => $._identifier_or_qualified_name,

  __display_skip_phrase: ($) =>
    prec.left(seq(kw("SKIP"), optional(field("skip", seq("(", $._expression, ")"))))),
  __display_space_phrase: ($) =>
    prec.left(seq(kw("SPACE"), optional(field("space", seq("(", $._expression, ")"))))),

  __display_frame_phrases: ($) => seq($.frame_phrase, optional($.frame_phrase)),

  // Second branch
  __display_browse_body: ($) =>
    seq(
      $.__display_items,
      kw("WITH"),
      kw("BROWSE"),
      field("browse", $.identifier),
      $._no_error_terminator,
    ),
});
