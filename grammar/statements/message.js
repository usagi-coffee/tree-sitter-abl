module.exports = ({ kw, tkw }) => ({
  message_statement: ($) => seq(kw("MESSAGE"), $.__message_body, $._terminator),

  __message_body: ($) =>
    seq(
      repeat1(
        choice(
          seq(kw("COLOR"), $.__message_color_value),
          $._expression,
          alias($.__message_skip_item, $.skip),
        ),
      ),
      optional(alias($.__message_view_as_phrase, $.view_as_phrase)),
      optional(alias($.__message_set_update_phrase, $.set_update_phrase)),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
    ),
  __message_color_value: ($) =>
    choice(
      tkw("NORMAL"),
      tkw("INPUT"),
      tkw("MESSAGES"),
      $.color_phrase,
    ),

  __message_view_as_phrase: ($) =>
    seq(
      kw("VIEW-AS"),
      tkw("ALERT-BOX"),
      optional(
        choice(
          tkw("MESSAGE"),
          tkw("QUESTION"),
          tkw("INFORMATION"),
          tkw("INFO"),
          tkw("ERROR"),
          tkw("WARNING"),
        ),
      ),
      optional(alias($.__message_buttons_phrase, $.buttons_phrase)),
      optional(seq(kw("TITLE"), field("title", $.string_literal))),
    ),

  __message_buttons_phrase: ($) =>
    seq(
      kw("BUTTONS"),
      choice(
        tkw("YES-NO"),
        tkw("YES-NO-CANCEL"),
        tkw("OK-CANCEL"),
        tkw("RETRY-CANCEL"),
        tkw("OK"),
      ),
    ),
  __message_skip_item: ($) =>
    prec.right(
      choice(
        seq(tkw("SKIP"), "(", field("count", $._expression), ")"),
        tkw("SKIP"),
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
      optional(tkw("AUTO-RETURN")),
    ),
  __message_field_name: ($) => choice($.identifier, $.qualified_name),
});
