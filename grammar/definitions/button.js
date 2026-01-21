module.exports = ({ kw }) => ({
  button_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("BUTTON"),
      field("name", $.identifier),
      repeat(alias($.__button_option, $.button_option)),
      $._terminator,
    ),

  __button_option: ($) =>
    choice(
      seq(kw("LABEL"), field("label", $.string_literal)),
      seq(kw("LIKE"), field("like", $.identifier)),
      seq(kw("AS"), field("type", $._type_name)),
    ),
});
