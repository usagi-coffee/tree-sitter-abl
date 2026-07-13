export default ({ kw }) => ({
  message_statement: ($) => seq($.__message_prefix, $._terminator),

  __message_prefix: ($) =>
    seq(
      kw("MESSAGE"),
      optional(
        seq(
          optional(
            seq(
              kw("COLOR"),
              field("color", choice(kw("NORMAL"), kw("INPUT"), kw("MESSAGES"), $.color_phrase)),
            ),
          ),
          repeat1($.__message_expression),
          optional($.__message_body_tail),
        ),
      ),
    ),
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

  __message_expression: ($) =>
    choice($._expression, alias($.__message_skip_item, $.skip), alias(kw("MENU"), $.identifier)),

  __message_view_as_phrase: ($) =>
    seq(kw("VIEW-AS"), kw("ALERT-BOX"), optional($._alert_box_options)),

  __message_skip_item: ($) =>
    prec.right(choice(seq(kw("SKIP"), "(", field("count", $._expression), ")"), kw("SKIP"))),

  __message_set_update_phrase: ($) =>
    seq(
      field("mode", choice(kw("SET"), kw("UPDATE"))),
      field("field", $._identifier_or_qualified_name),
      optional($.__message_set_update_options),
    ),
  __message_set_update_options: ($) =>
    choice(
      seq(
        choice(
          seq(kw("AS"), field("type", $._type_name)),
          seq(kw("LIKE"), field("like", $._identifier_or_qualified_name)),
        ),
        optional($.__message_set_update_after_type),
      ),
      $.__message_set_update_after_type,
    ),
  __message_set_update_after_type: ($) =>
    choice(
      seq($._format_string, optional($.__message_set_update_after_format)),
      $.__message_set_update_after_format,
    ),
  __message_set_update_after_format: ($) =>
    choice(
      seq(
        alias($._format_view_as, $.view_as_phrase),
        optional(alias(kw("AUTO-RETURN"), $.auto_return)),
      ),
      alias(kw("AUTO-RETURN"), $.auto_return),
    ),
});
