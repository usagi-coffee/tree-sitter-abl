export default ({ kw }) => ({
  format_phrase: ($) =>
    prec.right(
      repeat1(
        choice(
          $.__format_at_phrase,
          $._format_field_option,
          kw("AUTO-RETURN"),
          kw("BLANK"),
          kw("DEBLANK"),
          kw("DISABLE-AUTO-ZAP"),
          kw("NO-TAB-STOP"),
        ),
      ),
    ),

  _format_field_option: ($) =>
    choice(
      $._as_like,
      seq(kw("BGCOLOR"), field("bgcolor", $.__format_expression)),
      $._format_colon_to,
      seq(kw("COLUMN-LABEL"), field("column_label", $.__format_expression)),
      seq(kw("DCOLOR"), field("dcolor", $.__format_expression)),
      seq(kw("FGCOLOR"), field("fgcolor", $.__format_expression)),
      seq(kw("FONT"), field("font", $.__format_expression)),
      $._format_format,
      seq(kw("HELP"), field("help", $.__format_expression)),
      $._format_label,
      seq(kw("PFCOLOR"), field("pfcolor", $.__format_expression)),
      $._format_validate,
      $._format_view_as,
      seq(kw("WIDGET-ID"), field("widget_id", $.__format_expression)),
    ),
  __format_expression: ($) => $._expression,
  __format_alignment: ($) => choice(kw("COLON-ALIGNED"), kw("LEFT-ALIGNED"), kw("RIGHT-ALIGNED")),

  __format_at_phrase: ($) =>
    seq(
      kw("AT"),
      choice(
        field("at", token(/[0-9]+(\.[0-9]+)?/)),
        seq(
          choice(
            seq($.__format_at_column, $.__format_at_row),
            seq($.__format_at_x, $.__format_at_y),
          ),
          optional($.__format_alignment),
        ),
        seq(kw("COLUMN", { alias: "COL", offset: 3 }), field("column", $.number_literal)),
        seq(kw("ROW"), field("row", $.number_literal)),
      ),
    ),
  __format_at_column: ($) =>
    choice(
      seq(kw("COLUMN", { alias: "COL", offset: 3 }), field("column", $._expression)),
      seq(kw("COLUMN-OF"), field("column_of", $._expression)),
    ),
  __format_at_row: ($) =>
    choice(
      seq(kw("ROW"), field("row", $._expression)),
      seq(kw("ROW-OF"), field("row_of", $._expression)),
    ),
  __format_at_x: ($) =>
    choice(seq(kw("X"), field("x", $._expression)), seq(kw("X-OF"), field("x_of", $._expression))),
  __format_at_y: ($) =>
    choice(seq(kw("Y"), field("y", $._expression)), seq(kw("Y-OF"), field("y_of", $._expression))),

  __format_editor_options: ($) =>
    repeat1(
      choice(
        seq(kw("BUFFER-CHARS"), field("buffer_chars", $.number_literal)),
        seq(kw("BUFFER-LINES"), field("buffer_lines", $.number_literal)),
        kw("LARGE"),
        seq(kw("MAX-CHARS"), field("max_chars", $.number_literal)),
        kw("NO-BOX"),
        kw("NO-WORD-WRAP"),
        kw("SCROLLBAR-HORIZONTAL"),
        kw("SCROLLBAR-VERTICAL"),
        seq(kw("TOOLTIP"), field("tooltip", $._expression)),
      ),
    ),

  __format_size_phrase: ($) =>
    seq(
      choice(kw("SIZE"), kw("SIZE-CHARS"), kw("SIZE-PIXELS")),
      field("width", $.number_literal),
      kw("BY"),
      field("height", $.number_literal),
    ),

  _format_colon_to: ($) =>
    choice(
      seq(kw("COLON"), field("colon", $._expression)),
      seq(kw("TO"), field("to", $._expression)),
    ),

  __format_editor_phrase: ($) =>
    prec.left(
      seq(
        kw("EDITOR"),
        optional($.__format_editor_options),
        choice(
          $.__format_size_phrase,
          seq(
            kw("INNER-CHARS"),
            field("inner_chars", $.number_literal),
            kw("INNER-LINES"),
            field("inner_lines", $.number_literal),
          ),
        ),
        optional($.__format_editor_options),
      ),
    ),

  // These for some cursed reason cannot be moved to grammar/core/common.js

  _format_format: ($) =>
    seq(
      kw("FORMAT", { offset: 4 }),
      choice(
        field("format", $.string_literal),
        seq("(", field("format", $.string_literal), ")"),
        field(
          "format",
          choice(
            $.identifier,
            $.qualified_name,
            $.object_access,
            $.preprocessor_name,
            $.argument_reference,
          ),
        ),
      ),
    ),

  _format_label: ($) => choice(seq(kw("LABEL"), $._format_labels), kw("NO-LABELS")),
  _format_labels: ($) => seq(field("label", $._expression), optional($._format_labels_tail)),
  _format_labels_tail: ($) => repeat1(seq(",", field("label", $._expression))),

  _format_validate: ($) =>
    seq(
      kw("VALIDATE"),
      "(",
      field("condition", $._expression),
      ",",
      field("message", $._expression),
      ")",
    ),

  // Local VIEW-AS copies omit TOOLTIP to avoid competing with the enclosing format phrase.
  __format_radio_set_phrase: ($) =>
    seq(
      kw("RADIO-SET"),
      optional($.__format_radio_set_orientation),
      kw("RADIO-BUTTONS"),
      field("buttons", $.__format_radio_set_buttons),
      optional($.size_phrase),
    ),
  __format_radio_set_orientation: ($) =>
    choice(seq(kw("HORIZONTAL"), optional(kw("EXPAND"))), kw("VERTICAL")),
  __format_radio_set_buttons: ($) =>
    seq($.__format_radio_set_pair, repeat(seq(",", $.__format_radio_set_pair))),
  __format_radio_set_pair: ($) =>
    seq(
      field("label", $.__format_radio_set_value),
      ",",
      field("value", $.__format_radio_set_value),
    ),
  __format_radio_set_value: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      alias($._signed_number_literal, $.number_literal),
      $.boolean_literal,
    ),

  __format_combo_box_phrase: ($) =>
    seq(
      field("widget", kw("COMBO-BOX")),
      repeat(
        choice(
          seq(kw("LIST-ITEMS"), field("items", $.__format_combo_box_values)),
          seq(kw("LIST-ITEM-PAIRS"), field("pairs", $.__format_combo_box_pairs)),
          seq(kw("INNER-LINES"), field("inner_lines", $.number_literal)),
          $.size_phrase,
          alias(kw("SORT"), $.sort),
          alias(kw("SIMPLE"), $.simple),
          alias(kw("DROP-DOWN-LIST"), $.drop_down_list),
          alias(kw("DROP-DOWN"), $.drop_down),
          seq(kw("AUTO-COMPLETION"), optional(alias(kw("UNIQUE-MATCH"), $.unique_match))),
        ),
      ),
    ),
  __format_combo_box_values: ($) =>
    seq($.__format_radio_set_value, repeat(seq(",", $.__format_radio_set_value))),
  __format_combo_box_pairs: ($) =>
    seq($.__format_radio_set_pair, repeat(seq(",", $.__format_radio_set_pair))),

  __format_view_as_tail: ($) =>
    prec.right(choice(seq($.size_phrase, optional($._tooltip_phrase)), $._tooltip_phrase)),
  _format_view_as: ($) =>
    prec.right(
      seq(
        kw("VIEW-AS"),
        choice(
          seq(kw("TEXT"), optional($.__format_view_as_tail)),
          seq(kw("TOGGLE-BOX"), optional($.__format_view_as_tail)),
          seq(kw("FILL-IN"), optional(kw("NATIVE")), optional($.__format_view_as_tail)),
          alias($.__format_editor_phrase, $.editor_phrase),
          alias($.__format_radio_set_phrase, $.radio_set_phrase),
          alias($.__format_combo_box_phrase, $.combo_box_phrase),
          alias($.__view_as_alert_box, $.view_as_phrase),
        ),
      ),
    ),
});
