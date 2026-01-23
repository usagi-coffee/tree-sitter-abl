module.exports = ({ kw, tkw }) => ({
  browse_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(
        choice(
          seq(optional(kw("NEW")), kw("SHARED")),
          kw("PRIVATE"),
        ),
      ),
      kw("BROWSE"),
      field("name", $.identifier),
      kw("QUERY"),
      field("query", $.identifier),
      optional(
        choice(
          tkw("SHARE-LOCK"),
          tkw("EXCLUSIVE-LOCK"),
          tkw("NO-LOCK"),
        ),
      ),
      optional(tkw("NO-WAIT")),
      kw("DISPLAY"),
      choice(
        // Simple column list - just identifiers
        repeat1($.identifier),
        // Record with EXCEPT
        seq(field("record", $.identifier), kw("EXCEPT"), repeat1(field("field", $.identifier))),
      ),
      optional($.__browse_enable_phrase),
      repeat($.__browse_option),
      $._terminator,
    ),

  __browse_enable_phrase: ($) =>
    seq(
      kw("ENABLE"),
      optional(
        choice(
          kw("ALL"),
          repeat1(field("field", $.identifier)),
        ),
      ),
    ),

  __browse_option: ($) =>
    choice(
      seq(tkw("CONTEXT-HELP-ID"), $._expression),
      tkw("DROP-TARGET"),
      seq(kw("TOOLTIP"), $._expression),
      seq(kw("BGCOLOR"), $._expression),
      seq(kw("FGCOLOR"), $._expression),
      seq(kw("FONT"), $._expression),
      seq(kw("TITLE"), $.string_literal),
      seq(kw("WIDTH"), $._expression),
      seq(kw("DOWN"), optional($._expression)),
      tkw("NO-EMPTY-SPACE"),
      tkw("FIT-LAST-COLUMN"),
      tkw("MULTIPLE"),
      tkw("SEPARATORS"),
      tkw("NO-ROW-MARKERS"),
      tkw("NO-COLUMN-SCROLLING"),
      seq(tkw("MAX-DATA-GUESS"), $._expression),
      seq(kw("ROW"), $._expression),
      seq(kw("COLUMN"), $._expression),
      tkw("SCROLLBAR-HORIZONTAL"),
      tkw("SCROLLBAR-VERTICAL"),
      seq(kw("SIZE"), $._expression, kw("BY"), $._expression),
      seq(tkw("SIZE-CHARS"), $._expression, kw("BY"), $._expression),
      seq(tkw("SIZE-PIXELS"), $._expression, kw("BY"), $._expression),
      // $.on_phrase, // TODO: add trigger support
    ),
});
