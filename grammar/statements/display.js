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
        $._frame_phrases,
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
    choice(seq($.in_window_phrase, optional($._frame_phrases)), $._frame_phrases),
  __display_window_frame_phrases: ($) =>
    choice(seq($.in_window_phrase, $._frame_phrases), $._frame_phrases),

  __display_items: ($) =>
    choice(
      seq(field("record", $.__display_record), optional(seq(kw("EXCEPT"), $._except_name_list))),
      prec.right(seq($.__display_item, optional($.__display_items_tail))),
    ),
  __display_items_tail: ($) => prec.right(seq($.__display_item, optional($.__display_items_tail))),
  __display_item: ($) =>
    choice(
      seq(
        $.__display_formatted_field,
        optional($._when_phrase),
        optional(seq("@", field("base", $.__display_base_field))),
      ),
      seq(
        $.__display_formatted_field,
        seq("@", field("base", $.__display_base_field)),
        $.format_phrase,
        optional($._when_phrase),
      ),
      alias($.__display_aggregate_expression, $.aggregate_expression),
      $.__display_skip_phrase,
      $._display_space_phrase,
    ),
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
    prec.left(
      seq(kw("SKIP"), optional(field("skip", seq($._parenthesized_expression_prefix, ")")))),
    ),

  // Second branch
  __display_browse_body: ($) =>
    seq(
      $.__display_items,
      $._with_keyword,
      kw("BROWSE"),
      field("browse", $.identifier),
      $._no_error_terminator,
    ),

  __display_base_field: ($) =>
    choice($._identifier_or_qualified_name, alias($.__display_base_element, $.array_access)),
  __display_base_element: ($) =>
    seq(field("array", $._identifier_or_qualified_name), "[", field("index", $._expression), "]"),
});
