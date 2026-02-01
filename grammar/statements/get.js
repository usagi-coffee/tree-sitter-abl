module.exports = ({ kw }) => ({
  get_statement: ($) => seq(kw("GET"), $.__get_body, $._terminator),
  __get_body: ($) =>
    seq(
      field(
        "direction",
        choice(kw("FIRST"), kw("NEXT"), kw("PREV"), kw("LAST"), kw("CURRENT")),
      ),
      field("query", $.identifier),
      optional(
        field(
          "lock",
          choice(kw("SHARE-LOCK"), kw("EXCLUSIVE-LOCK"), kw("NO-LOCK")),
        ),
      ),
      optional(kw("NO-WAIT")),
    ),
});
