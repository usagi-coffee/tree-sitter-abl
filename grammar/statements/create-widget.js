export default ({ kw }) => ({
  create_widget_statement: ($) =>
    prec.right(seq($._kw_create, $.__create_widget_body, $._terminator)),
  __create_widget_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $.__create_widget_head,
      optional($.__no_error),
      optional(
        seq(
          choice(
            seq(
              alias($.__create_widget_assign_phrase, $.assign_phrase),
              optional($.trigger_phrase),
            ),
            $.trigger_phrase,
          ),
          optional($.__no_error),
        ),
      ),
    ),

  __create_widget_head: ($) =>
    seq(
      choice(
        $._kw_button,
        $._kw_browse,
        $._kw_combo_box,
        kw("CONTROL-FRAME"),
        kw("DIALOG-BOX"),
        $._kw_editor,
        $._kw_fill_in,
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        kw("FRAME", { offset: 4 }),
        $._kw_image,
        $._kw_menu,
        $._kw_menu_item,
        $._kw_radio_set,
        kw("RECTANGLE"),
        $._kw_selection_list,
        $._kw_slider,
        $._kw_sub_menu,
        $._kw_text,
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        kw("TOGGLE-BOX"),
        $._kw_window,
        seq($._kw_value, "(", field("widget_type", $._expression), ")"),
      ),
      optional(seq(field("handle", $._identifier_or_array_access), optional($._in_widget_pool))),
    ),

  __create_widget_assign_phrase: ($) => seq($._kw_assign, $._assign_pair_list),
});
