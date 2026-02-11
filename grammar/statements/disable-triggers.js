module.exports = ({ kw }) => ({
  disable_triggers_statement: ($) =>
    seq(kw("DISABLE"), $.__disable_treiggers_body, $._terminator),

  __disable_treiggers_body: ($) =>
    seq(
      kw("TRIGGERS"),
      kw("FOR"),
      field("mode", choice(kw("DUMP"), kw("LOAD"))),
      kw("OF"),
      field("table", $._identifier_or_qualified_name),
      optional(kw("ALLOW-REPLICATION")),
    ),
});
