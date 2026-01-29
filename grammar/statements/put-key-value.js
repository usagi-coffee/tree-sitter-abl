module.exports = ({ kw, tkw }) => ({
  put_key_value_statement: ($) =>
    seq(kw("PUT-KEY-VALUE"), $.__put_key_value_body, $._terminator),

  __put_key_value_body: ($) =>
    seq(
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
    ),
});
