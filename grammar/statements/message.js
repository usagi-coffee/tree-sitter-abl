module.exports = ({ kw }) => ({
  message_statement: ($) =>
    seq(kw("MESSAGE"), optional($.__message_body), $._terminator),

  __message_body: ($) =>
    seq(
      optional(seq(kw("COLOR"), $.__message_color_value)),
      repeat1($.__message_expression),
      optional(alias($.__message_view_as_phrase, $.view_as_phrase)),
      optional(alias($.__message_set_update_phrase, $.set_update_phrase)),
      optional($.in_window_phrase),
    ),

  __message_expression: ($) =>
    choice(
      $._expression,
      alias($.__message_skip_item, $.skip),
      alias(kw("MENU"), $.identifier),
    ),

  __message_color_value: ($) =>
    choice(kw("NORMAL"), kw("INPUT"), kw("MESSAGES"), $.color_phrase),

  __message_view_as_phrase: ($) =>
    seq(
      kw("VIEW-AS"),
      kw("ALERT-BOX"),
      optional(
        alias(
          choice(
            kw("MESSAGE"),
            kw("QUESTION"),
            kw("INFORMATION"),
            kw("INFO"),
            kw("ERROR"),
            kw("WARNING"),
          ),
          $.alert_type,
        ),
      ),
      optional(
        seq(
          kw("BUTTONS"),
          field(
            "buttons",
            choice(
              kw("YES-NO"),
              kw("YES-NO-CANCEL"),
              kw("OK-CANCEL"),
              kw("RETRY-CANCEL"),
              kw("OK"),
            ),
          ),
        ),
      ),
      optional(seq(kw("TITLE"), field("title", $.string_literal))),
    ),

  __message_skip_item: ($) =>
    prec.right(
      choice(
        seq(kw("SKIP"), "(", field("count", $._expression), ")"),
        kw("SKIP"),
      ),
    ),

  __message_set_update_phrase: ($) =>
    seq(
      choice(kw("SET"), kw("UPDATE")),
      field("field", $.__message_field_name),
      optional(
        choice(
          seq(kw("AS"), field("type", $._type_name)),
          seq(kw("LIKE"), field("like", $.__message_field_name)),
        ),
      ),
      optional(seq(kw("FORMAT"), field("format", $.string_literal))),
      optional(kw("AUTO-RETURN")),
    ),
  __message_field_name: ($) => $._identifier_or_qualified_name,
});
