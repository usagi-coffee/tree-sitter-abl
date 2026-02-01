module.exports = ({ kw }) => ({
  format_phrase: ($) =>
    seq(
      kw("FORMAT"),
      choice($.__format_phrase_string, seq("(", $.__format_phrase_string, ")")),
    ),

  __format_phrase_string: ($) =>
    seq(
      field("format", alias($._escaped_string, $.string_literal)),
      optional(
        token.immediate(/:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i),
      ),
    ),
});
