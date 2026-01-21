module.exports = ({ kw, tkw }) => ({
  message_statement: ($) =>
    seq(
      kw("MESSAGE"),
      repeat1(
        choice(
          alias($.__message_color_phrase, $.color_phrase),
          $._expression,
          alias($.__message_skip_item, $.skip),
        ),
      ),
      optional(alias($.__message_view_as_clause, $.view_as_clause)),
      optional(alias($.__message_set_update_clause, $.set_update_clause)),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),

  __message_view_as_clause: ($) =>
    seq(
      kw("VIEW-AS"),
      token(/ALERT-BOX/i),
      optional(
        choice(
          token(/MESSAGE/i),
          token(/QUESTION/i),
          token(/INFORMATION/i),
          token(/ERROR/i),
          token(/WARNING/i),
        ),
      ),
      optional(alias($.__message_buttons_clause, $.buttons_clause)),
      optional(seq(kw("TITLE"), field("title", $.string_literal))),
    ),

  __message_buttons_clause: ($) =>
    seq(
      kw("BUTTONS"),
      choice(
        token(/YES-NO/i),
        token(/YES-NO-CANCEL/i),
        token(/OK-CANCEL/i),
        token(/RETRY-CANCEL/i),
        token(/OK/i),
      ),
    ),
  __message_skip_item: ($) =>
    choice(
      seq(alias(token(/SKIP\(/i), "SKIP"), field("count", $._expression), ")"),
      tkw("SKIP"),
    ),
  __message_color_phrase: ($) =>
    seq(
      kw("COLOR"),
      choice(
        kw("NORMAL"),
        kw("INPUT"),
        kw("MESSAGES"),
        $.number_literal,
        seq(token(/VALUE/i), "(", field("value", $._expression), ")"),
        seq(
          optional(
            repeat1(
              choice(
                token(/BLINK-/i),
                token(/BRIGHT-/i),
                token(/RVV-/i),
                token(/UNDERLINE-/i),
              ),
            ),
          ),
          field("foreground", $.identifier),
        ),
      ),
    ),
  __message_set_update_clause: ($) =>
    seq(
      choice(kw("SET"), kw("UPDATE")),
      field("field", $.__message_field_name),
      choice(
        seq(kw("AS"), field("type", $._type_name)),
        seq(kw("LIKE"), field("like", $.__message_field_name)),
      ),
      optional(seq(kw("FORMAT"), field("format", $.string_literal))),
      optional(token(/AUTO-RETURN/i)),
    ),
  __message_field_name: ($) => choice($.identifier, $.qualified_name),
});
