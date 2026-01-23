module.exports = ({ kw, tkw }) => ({
  get_key_value_statement: ($) =>
    seq(
      kw("GET-KEY-VALUE"),
      kw("SECTION"),
      field("section", $._expression),
      choice(
        seq(
          kw("KEY"),
          field("key", $._expression),
          kw("VALUE"),
          field("value", $._expression),
        ),
        tkw("DEFAULT"),
      ),
      $._terminator,
    ),
});
