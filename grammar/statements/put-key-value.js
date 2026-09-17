export default ({ kw }) => ({
  put_key_value_statement: ($) => seq($.__put_key_value_prefix, $._no_error_terminator),

  __put_key_value_prefix: ($) =>
    seq(
      kw("PUT-KEY-VALUE", { offset: 11 }),
      choice(
        seq(
          $._key_section,
          kw("KEY"),
          choice(field("key", $._expression), kw("DEFAULT")),
          $._key_value,
        ),
        seq(choice(kw("COLOR"), kw("FONT")), choice(field("number", $._expression), kw("ALL"))),
      ),
    ),
});
