module.exports = ({ kw, tkw }) => ({
  enable_statement: ($) =>
    seq(
      tkw("ENABLE"),
      optional(tkw("UNLESS-HIDDEN")),
      choice(
        seq(
          tkw("ALL"),
          optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
        ),
        repeat1(alias($.__enable_item, $.enable_item)),
      ),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      optional(alias($.__enable_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __enable_item: ($) =>
    choice(
      seq(
        field("field", $._expression),
        optional(alias($.__enable_format_phrase, $.format_phrase)),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
      seq(
        tkw("TEXT"),
        "(",
        token(/[A-Za-z_][A-Za-z0-9_-]*/),
        alias($.__enable_format_phrase, $.format_phrase),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        choice(
          alias($.__enable_at_phrase, $.at_phrase),
          alias($.__enable_constant_option, $.constant_option),
        ),
        repeat(alias($.__enable_constant_option, $.constant_option)),
      ),
      tkw("SKIP"),
    ),
  __enable_format_phrase: ($) =>
    seq(
      kw("FORMAT"),
      $._escaped_string,
      optional(
        token.immediate(
          /:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i,
        ),
      ),
    ),
  __enable_at_phrase: ($) =>
    seq(kw("AT"), token(/[0-9]+(\.[0-9]+)?/)),
  __enable_constant_option: ($) =>
    choice(
      seq(kw("BGCOLOR"), token(/[0-9]+(\.[0-9]+)?/)),
      seq(tkw("VIEW-AS"), tkw("TEXT")),
    ),
  __enable_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
