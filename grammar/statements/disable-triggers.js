export default ({ kw }) => ({
  disable_triggers_statement: ($) => seq($._kw_disable, $.__disable_triggers_body, $._terminator),

  __disable_triggers_body: ($) =>
    seq(
      $._kw_triggers,
      $._kw_for,
      field("mode", choice(kw("DUMP"), $._kw_load)),
      $._kw_of,
      field("table", $._qualified_identifier),
      optional(alias(kw("ALLOW-REPLICATION"), $.allow_replication)),
    ),
});
