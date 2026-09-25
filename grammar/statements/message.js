export default ({ kw }) => ({
  message_statement: ($) => seq($.__message_prefix, $._terminator),

  __message_prefix: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("MESSAGE"),
      optional(
        seq(
          optional(
            seq(
              $._kw_color,
              field(
                "color",
                // oxlint-disable-next-line tree-sitter-optimize/shared-choice
                choice($._kw_normal, $._kw_input, $._kw_messages, $.color_phrase),
              ),
            ),
          ),
          $.__message_expressions,
          optional($.__message_body_tail),
        ),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/optional-tail-choice-collapse
  __message_body_tail: ($) =>
    choice(
      seq(alias($.__message_view_as_phrase, $.view_as_phrase), optional($.__message_window_tail)),
      $.__message_window_tail,
    ),
  __message_window_tail: ($) =>
    choice(
      seq(alias($.__message_set_update_phrase, $.set_update_phrase), optional($.in_window_phrase)),
      $.in_window_phrase,
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __message_expression: ($) =>
    choice($._expression, alias($.__message_skip_item, $.skip), alias($._kw_menu, $.identifier)),
  __message_expressions: ($) =>
    prec.right(seq($.__message_expression, optional($.__message_expressions))),

  __message_view_as_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
    seq(kw("VIEW-AS"), kw("ALERT-BOX"), optional($._alert_box_options)),

  __message_skip_item: ($) =>
    prec.right(
      choice(
        // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
        seq($._kw_skip, "(", field("count", $._expression), ")"),
        $._kw_skip,
      ),
    ),

  __message_set_update_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("mode", choice($._kw_set, $._kw_update)),
      field("field", $._qualified_identifier),
      optional(
        choice(
          $._as_type_name_phrase,
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq($._kw_like, field("like", $._qualified_identifier)),
        ),
      ),
      optional($.__message_set_update_after_type),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/optional-tail-choice-collapse
  __message_set_update_after_type: ($) =>
    choice(
      seq($._format_string, optional($.__message_set_update_after_format)),
      $.__message_set_update_after_format,
    ),
  __message_set_update_after_format: ($) =>
    choice(
      seq(
        alias($._format_view_as, $.view_as_phrase),
        optional(alias($._kw_auto_return, $.auto_return)),
      ),
      alias($._kw_auto_return, $.auto_return),
    ),
});
