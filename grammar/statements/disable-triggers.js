module.exports = ({ kw }) => ({
  disable_triggers_statement: ($) =>
    seq(
      kw("DISABLE"),
      kw("TRIGGERS"),
      kw("FOR"),
      field("mode", choice(kw("DUMP"), kw("LOAD"))),
      kw("OF"),
      field("table", $.__disable_triggers_record_name),
      optional(token(/ALLOW-REPLICATION/i)),
      $._terminator,
    ),

  __disable_triggers_record_name: ($) =>
    choice($.identifier, $.qualified_name),
});
