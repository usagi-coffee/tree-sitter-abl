export default ({ kw }) => ({
  __browse_body: ($) =>
    seq(
      field("name", $.identifier),
      $._kw_query,
      field("query", $.identifier),
      optional(alias(choice(kw("SHARE-LOCK"), kw("EXCLUSIVE-LOCK"), kw("NO-LOCK")), $.lock)),
      optional(alias(kw("NO-WAIT"), $.no_wait)),
      $._kw_display,
      choice($.__browse_columns, alias($.__browse_record, $.record)),
      optional($.__browse_body_tail),
    ),
});
