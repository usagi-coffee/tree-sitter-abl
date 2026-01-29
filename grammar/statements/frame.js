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
          repeat1(field("field", $.identifier)),
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
      kw("SPACE"),
      kw("SKIP"),
      seq(
        $._expression,
        optional($.__frame_at_phrase),
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
        optional($.__frame_at_phrase),
      ),
      seq(
        $.string_literal,
        optional(choice($.__frame_at_phrase, seq(kw("TO"), $._expression))),
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
        optional(choice($.__frame_at_phrase, seq(kw("TO"), $._expression))),
        optional(seq(kw("BGCOLOR"), $._expression)),
        optional(seq(kw("DCOLOR"), $._expression)),
        optional(seq(kw("FGCOLOR"), $._expression)),
        optional(seq(kw("FONT"), $._expression)),
        optional(seq(kw("PFCOLOR"), $._expression)),
        optional(seq(tkw("VIEW-AS"), kw("TEXT"))),
        optional(seq(tkw("WIDGET-ID"), $._expression)),
      ),
    ),

  __frame_at_phrase: ($) =>
    choice(
      seq(
        kw("AT"),
        choice(
          seq(kw("COLUMN"), $._expression),
          seq(tkw("COLUMN-OF"), field("ref", $.identifier)),
        ),
        optional(
          choice(
            seq(kw("ROW"), $._expression),
            seq(tkw("ROW-OF"), field("ref", $.identifier)),
          ),
        ),
        optional(
          choice(
            tkw("COLON-ALIGNED"),
            tkw("LEFT-ALIGNED"),
            tkw("RIGHT-ALIGNED"),
          ),
        ),
      ),
      seq(
        kw("AT"),
        choice(
          seq(kw("X"), $._expression),
          seq(tkw("X-OF"), field("ref", $.identifier)),
        ),
        optional(
          choice(
            seq(kw("Y"), $._expression),
            seq(tkw("Y-OF"), field("ref", $.identifier)),
          ),
        ),
        optional(
          choice(
            tkw("COLON-ALIGNED"),
            tkw("LEFT-ALIGNED"),
            tkw("RIGHT-ALIGNED"),
          ),
        ),
      ),
      seq(kw("AT"), $._expression),
    ),

  frame_phrase: ($) => seq(kw("WITH"), repeat($.__frame_option)),

  __frame_option: ($) =>
    choice(
      seq(kw("WIDTH"), $._expression),
      seq(kw("DOWN"), optional($._expression)),
      seq(kw("SIZE"), $._expression, kw("BY"), $._expression),
      seq(tkw("SIZE-CHARS"), $._expression, kw("BY"), $._expression),
      seq(tkw("SIZE-PIXELS"), $._expression, kw("BY"), $._expression),
      tkw("OVERLAY"),
      seq(kw("ROW"), $._expression),
      seq(kw("COLUMN"), $._expression),
      tkw("NO-LABELS"),
      tkw("SIDE-LABELS"),
      tkw("CENTERED"),
      tkw("NO-BOX"),
      seq(kw("FONT"), $._expression),
      seq(kw("BGCOLOR"), $._expression),
    ),
});
