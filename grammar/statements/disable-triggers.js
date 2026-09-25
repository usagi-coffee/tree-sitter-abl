export default ({ kw }) => ({
  disable_triggers_statement: ($) => seq($._kw_disable, $.__disable_triggers_body, $._terminator),

  __disable_triggers_body: ($) =>
    seq(
      $._kw_triggers,
      $._for_keyword,
      field("mode", choice(kw("DUMP"), $._kw_load)),
      $._of_keyword,
      field("table", $._qualified_identifier),
      optional(alias(kw("ALLOW-REPLICATION"), $.allow_replication)),
    ),
});
