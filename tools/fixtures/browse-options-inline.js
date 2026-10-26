export default grammar({
  rules: {
    __browse_body_tail: ($) =>
      choice(
        seq($.__browse_enable_phrase, optional($.__browse_options_phrase)),
        $.__browse_options_phrase,
      ),
    __browse_options_phrase: ($) => seq($._kw_with, optional($.__browse_options)),
    __browse_options: ($) => prec.right(seq($.__browse_option, optional($.__browse_options))),
  },
});
