module.exports = ({ kw }) => ({
  get_key_value_statement: ($) => seq($.__get_key_value_prefix, $._terminator),

  __get_key_value_prefix: ($) => seq(kw("GET-KEY-VALUE"), $.__get_key_value_body),
  __get_key_value_body: ($) =>
    seq(
      kw("SECTION"),
      field("section", $._expression),
      choice(
        seq(kw("KEY"), field("key", $._expression), kw("VALUE"), field("value", $._expression)),
        kw("DEFAULT"),
      ),
    ),
});
