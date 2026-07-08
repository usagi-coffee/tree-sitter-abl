module.exports = ({ kw }) => ({
  put_key_value_statement: ($) => seq($.__put_key_value_prefix, $._no_error_terminator),

  __put_key_value_prefix: ($) =>
    seq(
      kw("PUT-KEY-VALUE"),
      choice(
        seq(
          kw("SECTION"),
          field("section", $._expression),
          kw("KEY"),
          choice(field("key", $._expression), kw("DEFAULT")),
          kw("VALUE"),
          field("value", $._expression),
        ),
        seq(choice(kw("COLOR"), kw("FONT")), choice(field("number", $._expression), kw("ALL"))),
      ),
    ),
});
