module.exports = ({ kw }) => ({
  display_statement: ($) =>
    prec.left(
      seq(
        kw("DISPLAY", { offset: 3 }),
        choice($.__display_browse_body, $.__display_fields_body, $._terminator),
      ),
    ),

  __display_fields_body: ($) =>
    choice(
      prec(
        2,
        seq(
          $._stream_phrase,
          optional(kw("UNLESS-HIDDEN")),
          optional($.in_window_phrase),
          $.__display_frame_phrases,
          optional(alias(kw("NO-ERROR"), $.no_error)),
          $._terminator,
        ),
      ),
      seq(
        optional($._stream_phrase),
        optional(kw("UNLESS-HIDDEN")),
        $.__display_items,
        optional($.in_window_phrase),
        optional($.__display_frame_phrases),
        optional(alias(kw("NO-ERROR"), $.no_error)),
        $._terminator,
      ),
    ),

  __display_items: ($) =>
    choice(
      seq(
        field("record", $.__display_record),
        optional(
          seq(
            kw("EXCEPT"),
            repeat1(field("except", $._identifier_or_qualified_name)),
          ),
        ),
      ),
      prec.right(
        repeat1(
          choice(
            seq(
              alias($.__display_field, $.field),
              optional($.format_phrase),
              optional(
                seq(kw("WHEN"), field("when", $.__display_when_expression)),
              ),
              optional(
                seq(
                  "@",
                  field("base", $._identifier_or_qualified_name),
                ),
              ),
            ),
            $.__display_skip_phrase,
            $.__display_space_phrase,
          ),
        ),
      ),
    ),

  __display_when_expression: ($) => $._expression,

  __display_field: ($) =>
    prec.right(
      seq(
        field("field", choice($.__display_keyword_identifier, $._expression)),
        optional(
          prec.dynamic(1, seq("(", repeat1($.aggregate_phrase), ")")),
        ),
      ),
    ),
  __display_keyword_identifier: ($) => alias(kw("MENU"), $.identifier),

  __display_record: ($) => $._identifier_or_qualified_name,

  __display_skip_phrase: ($) =>
    prec.left(
      seq(kw("SKIP"), optional(field("skip", seq("(", $._expression, ")")))),
    ),
  __display_space_phrase: ($) =>
    prec.left(
      seq(kw("SPACE"), optional(field("space", seq("(", $._expression, ")")))),
    ),

  __display_frame_phrases: ($) =>
    seq($.frame_phrase, optional($.frame_phrase)),

  // Second branch
  __display_browse_body: ($) =>
    seq(
      $.__display_items,
      kw("WITH"),
      kw("BROWSE"),
      field("browse", $.identifier),
      optional(alias(kw("NO-ERROR"), $.no_error)),
      $._terminator,
    ),
});
