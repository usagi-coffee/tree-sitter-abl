module.exports = ({ kw }) => ({
  format_phrase: ($) =>
    prec.right(
      repeat1(
        choice(
          $.__format_at_phrase,
          $.__format_as_like,
          kw("AUTO-RETURN"),
          seq(kw("BGCOLOR"), field("bgcolor", $.__format_expression)),
          kw("BLANK"),
          $.__format_colon_to,
          seq(kw("COLUMN-LABEL"), field("column_label", $.__format_expression)),
          kw("DEBLANK"),
          seq(kw("DCOLOR"), field("dcolor", $.__format_expression)),
          kw("DISABLE-AUTO-ZAP"),
          seq(kw("FGCOLOR"), field("fgcolor", $.__format_expression)),
          seq(kw("FONT"), field("font", $.__format_expression)),
          $.__format_format,
          seq(kw("HELP"), field("help", $.__format_expression)),
          $.__format_label,
          kw("NO-TAB-STOP"),
          seq(kw("PFCOLOR"), field("pfcolor", $.__format_expression)),
          $.__format_validate,
          $.__format_view_as,
          seq(kw("WIDGET-ID"), field("widget_id", $.__format_expression)),
        ),
      ),
    ),

  __format_expression: ($) => $._expression,

  __format_at_phrase: ($) =>
    seq(
      kw("AT"),
      choice(
        field("at", token(/[0-9]+(\.[0-9]+)?/)),
        seq(
          choice(
            seq(kw("COLUMN"), field("column", $._expression)),
            seq(kw("COLUMN-OF"), field("column_of", $._expression)),
          ),
          choice(
            seq(kw("ROW"), field("row", $._expression)),
            seq(kw("ROW-OF"), field("row_of", $._expression)),
          ),
          optional(
            choice(
              kw("COLON-ALIGNED"),
              kw("LEFT-ALIGNED"),
              kw("RIGHT-ALIGNED"),
            ),
          ),
        ),
        seq(
          choice(
            seq(kw("X"), field("x", $._expression)),
            seq(kw("X-OF"), field("x_of", $._expression)),
          ),
          choice(
            seq(kw("Y"), field("y", $._expression)),
            seq(kw("Y-OF"), field("y_of", $._expression)),
          ),
          optional(
            choice(
              kw("COLON-ALIGNED"),
              kw("LEFT-ALIGNED"),
              kw("RIGHT-ALIGNED"),
            ),
          ),
        ),
      ),
    ),

  __format_as_like: ($) =>
    choice(
      seq(kw("AS"), field("as", $.identifier)),
      seq(kw("LIKE"), field("like", $._identifier_or_qualified_name)),
    ),

  __format_colon_to: ($) =>
    choice(
      seq(kw("COLON"), field("colon", $._expression)),
      seq(kw("TO"), field("to", $._expression)),
    ),

  __format_format: ($) =>
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

  __format_label: ($) =>
    choice(seq(kw("LABEL"), $.__format_labels), kw("NO-LABELS")),
  __format_labels: ($) =>
    seq(field("label", $._expression), optional($.__format_labels_tail)),
  __format_labels_tail: ($) => repeat1(seq(",", field("label", $._expression))),

  __format_validate: ($) =>
    seq(
      kw("VALIDATE"),
      "(",
      field("condition", $._expression),
      ",",
      field("message", $._expression),
      ")",
    ),

  __format_view_as: ($) =>
    seq(
      kw("VIEW-AS"),
      choice(
        kw("TEXT"),
        kw("TOGGLE-BOX"),
        alias($.__format_editor_phrase, $.editor_phrase),
      ),
    ),

  __format_editor_phrase: ($) =>
    prec.left(
      seq(
        kw("EDITOR"),
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
});
