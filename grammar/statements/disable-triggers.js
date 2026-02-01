module.exports = ({ kw }) => ({
  disable_triggers_statement: ($) =>
    seq(
      kw("DISABLE"),
      kw("TRIGGERS"),
      $.__disable_treiggers_body,
      $._terminator,
    ),

  __disable_treiggers_body: ($) =>
    seq(
      kw("FOR"),
      field("mode", choice(kw("DUMP"), kw("LOAD"))),
      kw("OF"),
      field("table", $.__disable_triggers_record_name),
      optional(kw("ALLOW-REPLICATION")),
    ),

  __disable_triggers_record_name: ($) => choice($.identifier, $.qualified_name),
});
