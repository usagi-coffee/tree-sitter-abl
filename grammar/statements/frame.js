module.exports = ({ kw }) => ({
  frame_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__frame_modifier),
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
          field("record", $._identifier_or_qualified_name),
          kw("EXCEPT"),
          repeat1(field("field", $._identifier_or_qualified_name)),
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
      $.__frame_skip_phrase,
      $.__frame_space_phrase,
      seq(
        $._expression,
        optional($.at_phrase),
        repeat($.__frame_display_option),
      ),
    ),

  __frame_form_item: ($) =>
    choice(
      kw("SPACE"),
      kw("SKIP"),
      seq(kw("SPACE"), "(", optional($._expression), ")"),
      seq(kw("SKIP"), "(", optional($._expression), ")"),
      seq(
        field("field", $._identifier_or_qualified_name),
        optional($.at_phrase),
      ),
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
      seq(kw("VIEW-AS"), kw("TEXT")),
      seq(kw("WIDGET-ID"), $._expression),
    ),

  __frame_skip_phrase: ($) =>
    prec.left(
      seq(kw("SKIP"), optional(field("skip", seq("(", $._expression, ")")))),
    ),
  __frame_space_phrase: ($) =>
    prec.left(
      seq(kw("SPACE"), optional(field("space", seq("(", $._expression, ")")))),
    ),
  __frame_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
});
