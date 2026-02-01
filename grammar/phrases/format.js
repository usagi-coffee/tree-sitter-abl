module.exports = ({ kw }) => ({
  format_phrase: ($) =>
    seq(
      kw("FORMAT"),
      choice($.__format_phrase_string, seq("(", $.__format_phrase_string, ")")),
    ),

  __format_phrase_string: ($) => field("format", $.string_literal),
});
