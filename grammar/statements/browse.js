export default ({ kw }) => ({
  browse_definition: ($) => seq($.__browse_prefix, $._terminator),

  __browse_prefix: ($) =>
    seq($._define_keyword, optional($._definition_scope_modifier), $._kw_browse, $.__browse_body),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/sequence-subset
  __browse_body: ($) =>
    seq(
      field("name", $.identifier),
      $._kw_query,
      field("query", $.identifier),
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice, tree-sitter-optimize/inline-keyword-owner
      optional(alias(choice(kw("SHARE-LOCK"), kw("EXCLUSIVE-LOCK"), kw("NO-LOCK")), $.lock)),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("NO-WAIT"), $.no_wait)),
      $._kw_display,
      choice($.__browse_columns, alias($.__browse_record, $.record)),
      optional($.__browse_body_tail),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __browse_body_tail: ($) =>
    choice(
      seq($.__browse_enable_phrase, optional($.__browse_options_phrase)),
      $.__browse_options_phrase,
    ),
  __browse_options_phrase: ($) => seq($._with_keyword, optional($.__browse_options)),
  __browse_options: ($) => prec.right(seq($.__browse_option, optional($.__browse_options))),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __browse_option: ($) =>
    choice(
      $._with_keyword,
      seq($._kw_context_help_id, field("context_help_id", $.__browse_option_expression)),
      $.__browse_flag_option,
      seq($._kw_tooltip, field("tooltip", $.__browse_option_expression)),
      seq($._kw_bgcolor, field("bgcolor", $.__browse_option_expression)),
      seq($._kw_dcolor, field("dcolor", $.__browse_option_expression)),
      seq($._kw_fgcolor, field("fgcolor", $.__browse_option_expression)),
      seq($._kw_font, field("font", $.__browse_option_expression)),
      seq($._kw_pfcolor, field("pfcolor", $.__browse_option_expression)),
      seq(
        kw("ROW-HEIGHT-CHARS", { alias: "ROW-HEIGHT", offset: 10 }),
        field("row_height_chars", $.__browse_option_expression),
      ),
      seq(kw("ROW-HEIGHT-PIXELS"), field("row_height_pixels", $.__browse_option_expression)),
      seq(
        $._kw_title,
        optional($._frame_title_option),
        field("title", $.__browse_option_expression),
      ),
      seq(kw("WIDTH"), field("width", $.__browse_option_expression)),
      choice(
        seq(field("down", $.number_literal), $._kw_down),
        seq($._kw_down, field("down", $.__browse_option_expression)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      seq(kw("CANCEL-BUTTON"), field("cancel_button", $.__browse_option_expression)),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      seq(kw("DEFAULT-BUTTON"), field("default_button", $.__browse_option_expression)),
      seq($._kw_retain, field("retain", $.__browse_option_expression)),
      seq($._kw_widget_id, field("widget_id", $.__browse_option_expression)),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      seq(kw("CONTEXT-HELP-FILE"), field("context_help_file", $.__browse_option_expression)),
      seq($._in_keyword, $._kw_window, field("window", $.__browse_option_expression)),
      seq(kw("MAX-DATA-GUESS"), field("max_data_guess", $.__browse_option_expression)),
      seq($._row_keyword, field("row", $.__browse_option_expression)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      seq(choice($._kw_column, kw("COL")), field("column", $.__browse_option_expression)),
      $._scrollbar_option,
      seq(
        $._kw_size,
        field("width", $.__browse_option_expression),
        $._by_keyword,
        field("height", $.__browse_option_expression),
      ),
      seq(
        $._kw_size_chars,
        field("width_chars", $.__browse_option_expression),
        $._by_keyword,
        field("height_chars", $.__browse_option_expression),
      ),
      seq(
        $._kw_size_pixels,
        field("width_pixels", $.__browse_option_expression),
        $._by_keyword,
        field("height_pixels", $.__browse_option_expression),
      ),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __browse_flag_option: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner -- this occurrence belongs to the browse flag choice
      alias(kw("DROP-TARGET"), $.drop_target),
      alias(kw("NO-LABELS", { alias: "NO-LABEL", offset: 8 }), $.no_labels),
      alias(kw("NO-UNDERLINE", { offset: 10 }), $.no_underline),
      alias(kw("NO-HELP"), $.no_help),
      alias(kw("NO-HIDE"), $.no_hide),
      alias(kw("SCROLLABLE"), $.scrollable),
      alias(kw("TOP-ONLY"), $.top_only),
      alias(kw("KEEP-TAB-ORDER"), $.keep_tab_order),
      alias(kw("CENTERED", { offset: 6 }), $.centered),
      alias(kw("THREE-D"), $.three_d),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("ATTR-SPACE"), $.attr_space),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-ATTR-SPACE"), $.no_attr_space),
      alias(kw("CONTEXT-HELP"), $.context_help),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("EXPORT"), $.export),
      alias(kw("USE-DICT-EXPS"), $.use_dict_exps),
      alias(kw("ACCUM"), $.accum),
      alias(kw("NO-EMPTY-SPACE"), $.no_empty_space),
      alias(kw("FIT-LAST-COLUMN"), $.fit_last_column),
      alias(kw("MULTIPLE"), $.multiple),
      alias(kw("SINGLE"), $.single),
      alias(kw("SEPARATORS"), $.separators),
      alias(kw("NO-SEPARATORS"), $.no_separators),
      alias(kw("EXPANDABLE"), $.expandable),
      alias(kw("NO-SCROLLBAR-VERTICAL"), $.no_scrollbar_vertical),
      alias(kw("NO-AUTO-VALIDATE"), $.no_auto_validate),
      alias(kw("NO-ASSIGN"), $.no_assign),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-VALIDATE"), $.no_validate),
      alias(kw("NO-BOX"), $.no_box),
      alias(kw("NO-ROW-MARKERS"), $.no_row_markers),
      alias($._kw_overlay, $.overlay),
      alias(kw("NO-COLUMN-SCROLLING"), $.no_column_scrolling),
    ),

  __browse_record: ($) =>
    seq(field("record", $.identifier), $._kw_except, $.__browse_record_fields),
  __browse_record_fields: ($) =>
    prec.right(seq(field("field", $.identifier), optional($.__browse_record_fields))),
  __browse_columns: ($) =>
    prec.right(seq(alias($.__browse_column, $.column), optional($.__browse_columns))),

  __browse_column: ($) =>
    prec.right(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        field("column", prec.right($._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/recurse
        repeat(
          choice(
            $._format_string,
            $._aggregate_label_phrase,
            // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
            alias(kw("NO-LABELS", { alias: "NO-LABEL", offset: 8 }), $.no_labels),
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
            seq(kw("WIDTH"), field("width", $.__browse_option_expression)),
            seq(kw("COLUMN-FONT"), field("column_font", $.__browse_option_expression)),
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
            seq(kw("COLUMN-LABEL"), field("column_label", $.string_literal)),
            seq(kw("COLUMN-DCOLOR"), field("column_dcolor", $.__browse_option_expression)),
            seq(kw("COLUMN-BGCOLOR"), field("column_bgcolor", $.__browse_option_expression)),
            seq(kw("COLUMN-FGCOLOR"), field("column_fgcolor", $.__browse_option_expression)),
            seq(kw("COLUMN-PFCOLOR"), field("column_pfcolor", $.__browse_option_expression)),
            seq(kw("LABEL-FONT"), field("label_font", $.__browse_option_expression)),
            seq(kw("LABEL-DCOLOR"), field("label_dcolor", $.__browse_option_expression)),
            seq(kw("LABEL-BGCOLOR"), field("label_bgcolor", $.__browse_option_expression)),
            seq(kw("LABEL-FGCOLOR"), field("label_fgcolor", $.__browse_option_expression)),
            seq(kw("LABEL-PFCOLOR"), field("label_pfcolor", $.__browse_option_expression)),
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
            seq($._help_keyword, field("help", $.string_literal)),
            seq(
              $._kw_validate,
              "(",
              field("validate", $.__browse_option_expression),
              ",",
              field("message", $.__browse_option_expression),
              ")",
            ),
            alias($._kw_auto_return, $.auto_return),
            alias($._kw_disable_auto_zap, $.disable_auto_zap),
            alias(kw("MOVEABLE"), $.moveable),
            alias(kw("RESIZABLE"), $.resizable),
            alias($.__browse_column_view_as, $.view_as_phrase),
          ),
        ),
        optional(alias(seq("@", field("base", $._identifier_or_qualified_name)), $.base_field)),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
  __browse_column_view_as: ($) => seq(kw("VIEW-AS"), field("widget", kw("TOGGLE-BOX"))),

  __browse_option_expression: ($) => prec.right($._expression),

  __browse_enable_phrase: ($) =>
    seq(
      $._kw_enable,
      choice(
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        alias(kw("ALL"), $.all),
        $.__browse_enable_fields,
      ),
    ),
  __browse_enable_fields: ($) =>
    prec.right(
      seq(
        field("field", seq($._input_field, optional($._format_phrases))),
        optional($.__browse_enable_fields),
      ),
    ),
});
