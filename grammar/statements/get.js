export default ({ kw }) => ({
  get_statement: ($) => seq($.__get_prefix, $._terminator),

  __get_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_get,
      field("direction", choice($._kw_first, kw("NEXT"), kw("PREV"), $._kw_last, kw("CURRENT"))),
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
