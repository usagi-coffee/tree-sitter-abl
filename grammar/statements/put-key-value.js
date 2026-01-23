module.exports = ({ kw, tkw }) => ({
  put_key_value_statement: ($) =>
    seq(
      kw("PUT-KEY-VALUE"),
      choice(
        seq(
          kw("SECTION"),
          field("section", $._expression),
          kw("KEY"),
          choice(field("key", $._expression), tkw("DEFAULT")),
          kw("VALUE"),
          field("value", $._expression),
        ),
        seq(
          choice(kw("COLOR"), kw("FONT")),
          choice(field("number", $._expression), tkw("ALL")),
        ),
      ),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
});
