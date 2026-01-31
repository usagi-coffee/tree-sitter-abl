module.exports = ({ kw, tkw }) => ({
  frame_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(choice(seq(optional(kw("NEW")), kw("SHARED")), kw("PRIVATE"))),
      kw("FRAME"),
      $.__frame_body,
      $._terminator,
    ),

  __frame_body: ($) =>
    seq(
      field(
        "name",
        choice($.identifier, alias($.constant_expression, $.constant)),
      ),
      choice(
        seq(
          field("record", choice($.qualified_name, $.identifier)),
          kw("EXCEPT"),
          repeat1(field("field", choice($.identifier, $.qualified_name))),
        ),
        repeat($.__frame_form_item),
      ),
      optional($.__frame_header_section),
      optional($.frame_phrase),
    ),

  __frame_header_section: ($) =>
    prec(1, seq(choice(kw("HEADER"), kw("BACKGROUND")), repeat1($.__frame_head_item))),

  __frame_head_item: ($) =>
    choice(
      prec(1, seq(tkw("SKIP"), "(", optional($._expression), ")")),
      prec(1, seq(tkw("SPACE"), "(", optional($._expression), ")")),
      tkw("SKIP"),
      tkw("SPACE"),
      seq($._expression, optional($.at_phrase), repeat($.__frame_display_option)),
    ),

  __frame_form_item: ($) =>
    choice(
      tkw("SPACE"),
      tkw("SKIP"),
      seq(tkw("SPACE"), "(", optional($._expression), ")"),
      seq(tkw("SKIP"), "(", optional($._expression), ")"),
      seq(field("field", choice($.qualified_name, $.identifier)), optional($.at_phrase)),
      seq(
        $.string_literal,
        optional(choice($.at_phrase, seq(kw("TO"), $._expression))),
        repeat($.__frame_display_option),
      ),
      seq(
        $.number_literal,
        optional(choice($.at_phrase, seq(kw("TO"), $._expression))),
        repeat($.__frame_display_option),
      ),
    ),

  __frame_display_option: ($) =>
    choice(
      seq(kw("BGCOLOR"), $._expression),
      seq(kw("DCOLOR"), $._expression),
      seq(kw("FGCOLOR"), $._expression),
      seq(kw("FONT"), $._expression),
      seq(kw("PFCOLOR"), $._expression),
      seq(tkw("VIEW-AS"), tkw("TEXT")),
      seq(tkw("WIDGET-ID"), $._expression),
    ),

});
