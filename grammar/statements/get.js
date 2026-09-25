export default ({ kw }) => ({
  get_statement: ($) => seq($.__get_prefix, $._terminator),

  __get_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_get,
      field("direction", choice(kw("FIRST"), kw("NEXT"), kw("PREV"), kw("LAST"), kw("CURRENT"))),
      field("query", $.identifier),
      optional(
        field(
          "lock",
          // oxlint-disable-next-line tree-sitter-optimize/shared-choice
          choice(kw("SHARE-LOCK"), kw("EXCLUSIVE-LOCK"), kw("NO-LOCK")),
        ),
      ),
      optional(alias(kw("NO-WAIT"), $.no_wait)),
    ),
});
