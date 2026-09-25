export default ({ kw }) => ({
  frame_phrase: ($) => seq($._with_keyword, optional($.__frame_options)),
  __frame_options: ($) => prec.right(seq($.__frame_option, optional($.__frame_options))),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __frame_option: ($) =>
    choice(
      $.at_phrase,
      $.size_phrase,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-LABELS"), $.no_labels),
      alias(kw("NO-LABEL"), $.no_label),
      alias(kw("SIDE-LABELS", { offset: 10 }), $.side_labels),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("CENTERED", { offset: 6 }), $.centered),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("THREE-D"), $.three_d),
      alias(kw("NO-BOX"), $.no_box),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("ATTR-SPACE"), $.attr_space),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-ATTR-SPACE"), $.no_attr_space),
      alias($._kw_overlay, $.overlay),
      alias(kw("PAGE-TOP"), $.page_top),
      alias(kw("PAGE-BOTTOM"), $.page_bottom),
      alias(kw("USE-TEXT"), $.use_text),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("BACKGROUND"), $.background),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-HIDE"), $.no_hide),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-UNDERLINE", { offset: 10 }), $.no_underline),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-HELP"), $.no_help),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-VALIDATE"), $.no_validate),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("SCROLLABLE"), $.scrollable),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("TOP-ONLY"), $.top_only),
      alias(kw("SCREEN-IO"), $.screen_io),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("KEEP-TAB-ORDER"), $.keep_tab_order),
      alias(kw("DROP-TARGET"), $.drop_target),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("CONTEXT-HELP"), $.context_help),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("EXPORT"), $.export),
      alias(kw("USE-DICT-EXPS"), $.use_dict_exps),
      alias(kw("ACCUM"), $.accum),
      $.__frame_with_identifier,
      seq($._row_keyword, field("row", $.__frame_expression)),
      seq(kw("WIDTH"), field("width", $.__frame_expression)),
      seq($._kw_font, field("font", $.number_literal)),
      seq(kw("CANCEL-BUTTON"), field("cancel_button", $.__frame_identifier)),
      seq(kw("DEFAULT-BUTTON"), field("default_button", $.__frame_identifier)),
      seq(kw("SCROLL"), field("scroll", $.__frame_expression)),
      seq($._kw_retain, field("retain", $.__frame_expression)),
      seq($._kw_widget_id, field("widget_id", $.__frame_expression)),
      seq(kw("CONTEXT-HELP-FILE"), field("context_help_file", $.__frame_expression)),
      seq($._in_keyword, $._kw_window, field("window", $.__frame_identifier)),
      seq($._kw_bgcolor, field("bgcolor", $.__frame_expression)),
      seq($._kw_dcolor, field("dcolor", $.__frame_expression)),
      seq($._kw_fgcolor, field("fgcolor", $.__frame_expression)),
      seq($._kw_pfcolor, field("pfcolor", $.__frame_expression)),
      seq(
        $._kw_color,
        optional($._kw_display),
        field("color", $.__frame_color_value),
        optional(seq($._kw_prompt, field("prompt_color", $.__frame_color_value))),
      ),
      seq($._kw_title, optional($.__frame_title_options), field("title", $.__frame_expression)),
      choice(
        seq(field("column", $.number_literal), $.__frame_column_keyword),
        seq($.__frame_column_keyword, field("column", $.__frame_expression)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(seq(kw("VIEW-AS"), field("widget", kw("DIALOG-BOX"))), $.view_as_phrase),
      $.down,
      prec.left(
        seq($._kw_skip, optional(field("skip", seq($._parenthesized_expression_prefix, ")")))),
      ),
    ),

  __frame_title_options: ($) =>
    prec.right(seq($._frame_title_option, optional($.__frame_title_options))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline
  _frame_title_option: ($) =>
    choice(
      seq($._kw_bgcolor, field("title_bgcolor", $.__frame_expression)),
      seq($._kw_dcolor, field("title_dcolor", $.__frame_expression)),
      seq($._kw_fgcolor, field("title_fgcolor", $.__frame_expression)),
      seq($._kw_font, field("title_font", $.__frame_expression)),
    ),
  __frame_column_keyword: ($) => choice($._kw_column, kw("COLUMNS"), kw("COL")),
  // oxlint-disable-next-line tree-sitter-optimize/choice-subset, tree-sitter-optimize/shared-choice
  __frame_identifier: ($) => choice($.identifier, $.preprocessor_name),
  // oxlint-disable-next-line tree-sitter-optimize/forwarding-rule
  __frame_expression: ($) => $._expression,
  down: ($) =>
    choice(
      prec.right(
        seq(
          $._kw_down,
          optional(field("count", choice($.number_literal, $.parenthesized_expression))),
        ),
      ),
      seq(field("value", $.__frame_expression), $._kw_down),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/shared-choice
  __frame_color_value: ($) => choice(kw("NORMAL"), $._kw_input, kw("MESSAGES"), $.color_phrase),

  __frame_with_identifier: ($) =>
    prec.right(
      seq(
        choice(
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          seq(kw("FRAME", { offset: 4 }), field("frame", $.__frame_identifier)),
          seq($._kw_browse, field("browse", $.__frame_identifier)),
        ),
        optional($._with_keyword),
      ),
    ),
});
