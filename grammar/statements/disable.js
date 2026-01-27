module.exports = ({ kw, tkw }) => ({
  disable_statement: ($) =>
    seq(
      tkw("DISABLE"),
      optional(tkw("UNLESS-HIDDEN")),
      choice(
        seq(
          tkw("ALL"),
          optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
        ),
        repeat1(alias($.__disable_item, $.disable_item)),
      ),
      optional(alias($.__disable_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __disable_item: ($) =>
    choice(
      seq(
        field("field", $._expression),
        optional(alias($.__disable_format_phrase, $.format_phrase)),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
      seq(
        tkw("TEXT"),
        "(",
        alias($.identifier, $._disable_text_field),
        alias($.__disable_format_phrase, $.format_phrase),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        choice(
          alias($.__disable_at_phrase, $.at_phrase),
          alias($.__disable_constant_option, $.constant_option),
        ),
        repeat(alias($.__disable_constant_option, $.constant_option)),
      ),
      tkw("SKIP"),
    ),
  __disable_format_phrase: ($) =>
    seq(kw("FORMAT"), alias($.string_literal, $._disable_format_string)),
  __disable_at_phrase: ($) =>
    seq(kw("AT"), alias($.number_literal, $._disable_at_position)),
  __disable_constant_option: ($) =>
    choice(
      seq(kw("BGCOLOR"), alias($.number_literal, $._disable_bgcolor)),
      seq(tkw("VIEW-AS"), tkw("TEXT")),
    ),
  __disable_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
