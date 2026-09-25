export default ({ kw }) => ({
  format_phrase: ($) => $.__format_options,
  __format_options: ($) => prec.right(seq($.__format_option, optional($.__format_options))),
  __format_option: ($) =>
    choice(
      $.__format_at_phrase,
      $._format_field_option,
      $._kw_auto_return,
      $._kw_blank,
      $._kw_deblank,
      $._kw_disable_auto_zap,
      kw("NO-TAB-STOP"),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/single-use-shared-choice-inline
  _format_field_option: ($) =>
    choice(
      $._as_like,
      seq($._kw_bgcolor, field("bgcolor", $.__format_expression)),
      $._format_colon_to,
      seq(kw("COLUMN-LABEL"), field("column_label", $.__format_expression)),
      seq($._kw_dcolor, field("dcolor", $.__format_expression)),
      seq($._kw_fgcolor, field("fgcolor", $.__format_expression)),
      seq($._kw_font, field("font", $.__format_expression)),
      $._format_format,
      seq($._help_keyword, field("help", $.__format_expression)),
      $._format_label,
      seq($._kw_pfcolor, field("pfcolor", $.__format_expression)),
      $._format_validate,
      $._format_view_as,
      seq($._kw_widget_id, field("widget_id", $.__format_expression)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/forwarding-rule
  __format_expression: ($) => $._expression,

  __format_at_phrase: ($) =>
    seq(
      $._at_keyword,
      choice(
        field("at", token(/[0-9]+(\.[0-9]+)?/)),
        seq(
          choice(
            seq($.__format_at_column, $.__format_at_row),
            seq($.__format_at_x, $.__format_at_y),
          ),
          optional($._alignment),
        ),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        seq(kw("COLUMN", { alias: "COL", offset: 3 }), field("column", $.number_literal)),
        seq($._row_keyword, field("row", $.number_literal)),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __format_at_column: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      seq(kw("COLUMN", { alias: "COL", offset: 3 }), field("column", $._expression)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("COLUMN-OF"), field("column_of", $._expression)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __format_at_row: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._row_keyword, field("row", $._expression)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("ROW-OF"), field("row_of", $._expression)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __format_at_x: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_x, field("x", $._expression)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("X-OF"), field("x_of", $._expression)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __format_at_y: ($) =>
    choice(seq($._kw_y, field("y", $._expression)), seq(kw("Y-OF"), field("y_of", $._expression))),

  __format_editor_options: ($) =>
    prec.right(seq($.__format_editor_option, optional($.__format_editor_options))),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __format_editor_option: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("BUFFER-CHARS"), field("buffer_chars", $.number_literal)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("BUFFER-LINES"), field("buffer_lines", $.number_literal)),
      kw("LARGE"),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_max_chars, field("max_chars", $.number_literal)),
      kw("NO-BOX"),
      kw("NO-WORD-WRAP"),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("SCROLLBAR-HORIZONTAL"),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("SCROLLBAR-VERTICAL"),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_tooltip, field("tooltip", $._expression)),
    ),

  _format_colon_to: ($) =>
    prec(
      "format_position",
      choice(
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("COLON"), field("colon", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._to_keyword, field("to", $._expression)),
      ),
    ),

  __format_editor_phrase: ($) =>
    prec.left(
      seq(
        kw("EDITOR"),
        optional($.__format_editor_options),
        $.__format_editor_size,
        optional($.__format_editor_options),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/body-extraction
  __format_editor_size: ($) =>
    choice(
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/shared-choice
        choice($._kw_size, $._kw_size_chars, $._kw_size_pixels),
        $._width_by,
        field("height", $.number_literal),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._inner_chars_value, $._kw_inner_lines, field("inner_lines", $.number_literal)),
    ),

  // These for some cursed reason cannot be moved to grammar/core/common.js

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline, tree-sitter-optimize/shared-precedence-sequence-inline
  _format_format: ($) =>
    prec(
      "format_value",
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
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _format_label: ($) => choice(seq($._kw_label, $._format_labels), kw("NO-LABELS")),
  _format_labels: ($) => seq(field("label", $._expression), optional(seq(",", $._format_labels))),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline, tree-sitter-optimize/shared-closing-delimiter-inline
  _format_validate: ($) => seq($.__format_validate_prefix, ")"),
  __format_validate_prefix: ($) =>
    seq(
      $._kw_validate,
      "(",
      field("condition", $._expression),
      ",",
      field("message", $._expression),
    ),

  // Local VIEW-AS copies omit TOOLTIP to avoid competing with the enclosing format phrase.
  __format_radio_set_phrase: ($) =>
    seq(
      $._kw_radio_set,
      optional($.__radio_set_orientation),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("RADIO-BUTTONS"),
      field("buttons", $.__format_radio_set_buttons),
      optional($.size_phrase),
    ),
  __format_radio_set_buttons: ($) =>
    seq(
      field("label", $.__format_radio_set_value),
      ",",
      field("value", $.__format_radio_set_value),
      optional(seq(",", $.__format_radio_set_buttons)),
    ),
  __format_radio_set_value: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      alias($._signed_number_literal, $.number_literal),
      $.boolean_literal,
      $.null_literal,
    ),

  __format_combo_box_phrase: ($) =>
    seq(
      field("widget", kw("COMBO-BOX")),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat(
        choice(
          seq(kw("LIST-ITEMS"), field("items", $.__format_combo_box_values)),
          seq(kw("LIST-ITEM-PAIRS"), field("pairs", $.__format_radio_set_buttons)),
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq($._kw_inner_lines, field("inner_lines", $.number_literal)),
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
    seq($.__format_radio_set_value, optional(seq(",", $.__format_combo_box_values))),
  __format_view_as_tail: ($) =>
    prec.right(choice(seq($.size_phrase, optional($._tooltip_phrase)), $._tooltip_phrase)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline, tree-sitter-optimize/shared-precedence-sequence-inline
  _format_view_as: ($) =>
    prec.right(
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        kw("VIEW-AS"),
        choice(
          seq($._kw_text, optional($.__format_view_as_tail)),
          seq(kw("TOGGLE-BOX"), optional($.__format_view_as_tail)),
          // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
          seq(kw("FILL-IN"), optional(kw("NATIVE")), optional($.__format_view_as_tail)),
          alias($.__format_editor_phrase, $.editor_phrase),
          alias($.__format_radio_set_phrase, $.radio_set_phrase),
          alias($.__format_combo_box_phrase, $.combo_box_phrase),
          alias($.__view_as_alert_box, $.view_as_phrase),
        ),
      ),
    ),
});
