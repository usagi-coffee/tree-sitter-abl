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
    seq(choice(kw("HEADER"), kw("BACKGROUND")), repeat1($.__frame_head_item)),

  __frame_head_item: ($) =>
    choice(
      prec.left(1, seq(kw("SPACE"), optional(seq("(", optional($._expression), ")")))),
      prec.left(1, seq(kw("SKIP"), optional(seq("(", optional($._expression), ")")))),
      seq(
        $._expression,
        optional($.at_phrase),
        optional(seq(kw("BGCOLOR"), $._expression)),
        optional(seq(kw("DCOLOR"), $._expression)),
        optional(seq(kw("FGCOLOR"), $._expression)),
        optional(seq(kw("FONT"), $._expression)),
        optional(seq(kw("PFCOLOR"), $._expression)),
        optional(seq(tkw("VIEW-AS"), tkw("TEXT"))),
        optional(seq(tkw("WIDGET-ID"), $._expression)),
      ),
    ),

  __frame_form_item: ($) =>
    choice(
      tkw("SPACE"),
      tkw("SKIP"),
      seq(tkw("SPACE"), "(", optional($._expression), ")"),
      seq(tkw("SKIP"), "(", optional($._expression), ")"),
      seq(
        field("field", choice($.qualified_name, $.identifier)),
        optional($.at_phrase),
      ),
      seq(
        $.string_literal,
        optional(choice($.at_phrase, seq(kw("TO"), $._expression))),
        optional(seq(kw("BGCOLOR"), $._expression)),
        optional(seq(kw("DCOLOR"), $._expression)),
        optional(seq(kw("FGCOLOR"), $._expression)),
        optional(seq(kw("FONT"), $._expression)),
        optional(seq(kw("PFCOLOR"), $._expression)),
        optional(seq(tkw("VIEW-AS"), kw("TEXT"))),
        optional(seq(tkw("WIDGET-ID"), $._expression)),
      ),
      seq(
        $.number_literal,
        optional(choice($.at_phrase, seq(kw("TO"), $._expression))),
        optional(seq(kw("BGCOLOR"), $._expression)),
        optional(seq(kw("DCOLOR"), $._expression)),
        optional(seq(kw("FGCOLOR"), $._expression)),
        optional(seq(kw("FONT"), $._expression)),
        optional(seq(kw("PFCOLOR"), $._expression)),
        optional(seq(tkw("VIEW-AS"), kw("TEXT"))),
        optional(seq(tkw("WIDGET-ID"), $._expression)),
      ),
    ),

});
