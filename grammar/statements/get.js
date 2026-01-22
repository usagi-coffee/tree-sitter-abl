module.exports = ({ kw, tkw }) => ({
  get_statement: ($) =>
    seq(
      tkw("GET"),
      field(
        "direction",
        choice(tkw("FIRST"), tkw("NEXT"), tkw("PREV"), tkw("LAST"), tkw("CURRENT")),
      ),
      field("query", $.identifier),
      optional(
        field(
          "lock",
          choice(tkw("SHARE-LOCK"), tkw("EXCLUSIVE-LOCK"), tkw("NO-LOCK")),
        ),
      ),
      optional(tkw("NO-WAIT")),
      $._terminator,
    ),
});
