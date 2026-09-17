export default ({ kw }) => ({
  get_key_value_statement: ($) => seq($.__get_key_value_prefix, $._terminator),

  __get_key_value_prefix: ($) =>
    seq(
      kw("GET-KEY-VALUE"),
      $._key_section,
      choice(
        seq(kw("KEY"), field("key", $._expression), kw("VALUE"), field("value", $._expression)),
        kw("DEFAULT"),
      ),
    ),
});
