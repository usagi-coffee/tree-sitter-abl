module.exports = ({ kw }) => ({
  sql_alter_database_set_pro_enable_large_keys_statement: ($) =>
    seq(
      kw("ALTER"),
      kw("DATABASE"),
      kw("SET"),
      kw("PRO_ENABLE_LARGE_KEYS"),
      field("value", $.__sql_value),
      $._terminator,
    ),

  sql_alter_database_set_pro_enable_64bit_sequences_statement: ($) =>
    seq(
      kw("ALTER"),
      kw("DATABASE"),
      kw("SET"),
      kw("PRO_ENABLE_64BIT_SEQUENCES"),
      field("value", $.__sql_value),
      $._terminator,
    ),

  sql_alter_database_set_column_statistics_statement: ($) =>
    seq(
      kw("ALTER"),
      kw("DATABASE"),
      kw("SET"),
      kw("COLUMN"),
      kw("STATISTICS"),
      kw("CIPHER"),
      field("cipher", $.__sql_value),
      optional(alias(seq(kw("WITH"), kw("DELETE")), $.with_delete)),
      $._terminator,
    ),

  sql_alter_group_statement: ($) =>
    seq(
      kw("ALTER"),
      kw("GROUP"),
      field("group", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_alter_sequence_statement: ($) =>
    seq(
      kw("ALTER"),
      kw("SEQUENCE"),
      field("sequence", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_alter_table_statement: ($) =>
    seq(
      kw("ALTER"),
      kw("TABLE"),
      field("table", $.__sql_name),
      field("body", $.__sql_tail),
      $._terminator,
    ),

  sql_alter_tenant_statement: ($) =>
    seq(
      kw("ALTER"),
      kw("TENANT"),
      field("tenant", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_alter_user_statement: ($) =>
    seq(
      kw("ALTER"),
      kw("USER"),
      field("user", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_audit_insert_statement: ($) =>
    seq(kw("AUDIT"), kw("INSERT"), field("body", $.__sql_tail), $._terminator),

  sql_audit_set_statement: ($) =>
    seq(kw("AUDIT"), kw("SET"), field("body", $.__sql_tail), $._terminator),

  sql_commit_statement: ($) =>
    seq(kw("COMMIT"), optional(field("body", $.__sql_tail)), $._terminator),

  sql_connect_as_catalog_statement: ($) =>
    seq(
      kw("CONNECT"),
      kw("AS"),
      kw("CATALOG"),
      field("catalog", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_create_domain_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("DOMAIN"),
      field("domain", $.__sql_name),
      field("body", $.__sql_tail),
      $._terminator,
    ),

  sql_create_group_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("GROUP"),
      field("group", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_create_index_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("INDEX"),
      field("index", $.__sql_name),
      field("body", $.__sql_tail),
      $._terminator,
    ),

  sql_create_procedure_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("PROCEDURE"),
      field("procedure", $.__sql_procedure_name),
      field("body", $.__sql_tail),
      $._terminator,
    ),

  sql_create_sequence_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("SEQUENCE"),
      field("sequence", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_create_super_tenant_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("SUPER-TENANT"),
      field("tenant", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_create_synonym_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("SYNONYM"),
      field("synonym", $.__sql_name),
      field("body", $.__sql_tail),
      $._terminator,
    ),
  sql_create_table_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("TABLE"),
      field("table", $.__sql_name),
      field("body", $.__sql_tail),
      $._terminator,
    ),

  sql_create_tenant_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("TENANT"),
      field("tenant", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_create_trigger_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("TRIGGER"),
      field("trigger", $.__sql_name),
      field("body", $.__sql_tail),
      $._terminator,
    ),

  sql_create_user_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("USER"),
      field("user", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_create_view_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("VIEW"),
      field("view", $.__sql_name),
      field("body", $.__sql_tail),
      $._terminator,
    ),

  sql_delete_statement: ($) =>
    seq(
      kw("DELETE"),
      kw("FROM"),
      field("table", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_disconnect_catalog_statement: ($) =>
    seq(
      kw("DISCONNECT"),
      kw("CATALOG"),
      optional(field("catalog", $.__sql_name)),
      $._terminator,
    ),

  sql_drop_domain_statement: ($) =>
    seq(
      kw("DROP"),
      kw("DOMAIN"),
      field("domain", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_drop_group_statement: ($) =>
    seq(
      kw("DROP"),
      kw("GROUP"),
      field("group", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_drop_index_statement: ($) =>
    seq(
      kw("DROP"),
      kw("INDEX"),
      field("index", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_drop_procedure_statement: ($) =>
    seq(
      kw("DROP"),
      kw("PROCEDURE"),
      field("procedure", $.__sql_procedure_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_drop_sequence_statement: ($) =>
    seq(
      kw("DROP"),
      kw("SEQUENCE"),
      field("sequence", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_drop_synonym_statement: ($) =>
    seq(
      kw("DROP"),
      kw("SYNONYM"),
      field("synonym", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_drop_table_statement: ($) =>
    seq(
      kw("DROP"),
      kw("TABLE"),
      field("table", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_drop_tenant_statement: ($) =>
    seq(
      kw("DROP"),
      kw("TENANT"),
      field("tenant", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_drop_trigger_statement: ($) =>
    seq(
      kw("DROP"),
      kw("TRIGGER"),
      field("trigger", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_drop_user_statement: ($) =>
    seq(
      kw("DROP"),
      kw("USER"),
      field("user", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_drop_view_statement: ($) =>
    seq(
      kw("DROP"),
      kw("VIEW"),
      field("view", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_grant_statement: ($) =>
    seq(kw("GRANT"), field("body", $.__sql_tail), $._terminator),

  sql_insert_statement: ($) =>
    seq(
      kw("INSERT"),
      kw("INTO"),
      field("table", $.__sql_name),
      field("body", $.__sql_tail),
      $._terminator,
    ),

  sql_lock_table_statement: ($) =>
    seq(
      kw("LOCK"),
      kw("TABLE"),
      field("table", $.__sql_name),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_revoke_statement: ($) =>
    seq(kw("REVOKE"), field("body", $.__sql_tail), $._terminator),

  sql_rollback_statement: ($) =>
    seq(kw("ROLLBACK"), optional(field("body", $.__sql_tail)), $._terminator),

  sql_select_statement: ($) =>
    seq(kw("SELECT"), field("body", $.__sql_tail), $._terminator),

  sql_set_catalog_statement: ($) =>
    seq(
      kw("SET"),
      kw("CATALOG"),
      field("catalog", $.__sql_name),
      $._terminator,
    ),

  sql_set_database_default_area_statement: ($) =>
    seq(
      kw("SET"),
      kw("DATABASE"),
      kw("DEFAULT"),
      kw("AREA"),
      field("area", $.__sql_value),
      $._terminator,
    ),

  sql_set_pro_connect_log_statement: ($) =>
    seq(
      kw("SET"),
      kw("PRO_CONNECT"),
      kw("LOG"),
      field("value", $.__sql_value),
      $._terminator,
    ),

  sql_set_pro_connect_query_timeout_statement: ($) =>
    seq(
      kw("SET"),
      kw("PRO_CONNECT"),
      kw("QUERY_TIMEOUT"),
      field("value", $.__sql_value),
      $._terminator,
    ),

  sql_set_pro_server_query_timeout_statement: ($) =>
    seq(
      kw("SET"),
      kw("PRO_SERVER"),
      kw("QUERY_TIMEOUT"),
      field("value", $.__sql_value),
      $._terminator,
    ),

  sql_set_pro_server_log_statement: ($) =>
    seq(
      kw("SET"),
      kw("PRO_SERVER"),
      kw("LOG"),
      field("value", $.__sql_value),
      $._terminator,
    ),

  sql_set_rowcount_statement: ($) =>
    seq(
      kw("SET"),
      kw("ROWCOUNT"),
      field("value", $.__sql_value),
      $._terminator,
    ),

  sql_set_schema_statement: ($) =>
    seq(kw("SET"), kw("SCHEMA"), field("schema", $.__sql_name), $._terminator),

  sql_set_transaction_isolation_level_statement: ($) =>
    seq(
      kw("SET"),
      kw("TRANSACTION"),
      kw("ISOLATION"),
      kw("LEVEL"),
      field("level", $.__sql_tail),
      $._terminator,
    ),

  sql_show_catalogs_statement: ($) =>
    seq(kw("SHOW"), kw("CATALOGS"), $._terminator),

  sql_show_database_default_area_statement: ($) =>
    seq(kw("SHOW"), kw("DATABASE"), kw("DEFAULT"), kw("AREA"), $._terminator),

  sql_show_group_statement: ($) =>
    seq(
      kw("SHOW"),
      kw("GROUP"),
      optional(field("group", $.__sql_name)),
      $._terminator,
    ),

  sql_show_partition_statement: ($) =>
    seq(
      kw("SHOW"),
      kw("PARTITION"),
      optional(field("partition", $.__sql_name)),
      $._terminator,
    ),

  sql_show_rowcount_statement: ($) =>
    seq(kw("SHOW"), kw("ROWCOUNT"), $._terminator),

  sql_show_tenant_statement: ($) =>
    seq(
      kw("SHOW"),
      kw("TENANT"),
      optional(field("tenant", $.__sql_name)),
      $._terminator,
    ),

  sql_show_encrypt_on_statement: ($) =>
    seq(
      kw("SHOW"),
      kw("ENCRYPT"),
      kw("ON"),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  sql_show_column_statistics_cipher_statement: ($) =>
    seq(
      kw("SHOW"),
      kw("COLUMN"),
      kw("STATISTICS"),
      kw("CIPHER"),
      $._terminator,
    ),

  sql_update_statement: ($) =>
    seq(
      kw("UPDATE"),
      field("table", $.__sql_name),
      kw("SET"),
      field("body", $.__sql_tail),
      $._terminator,
    ),

  sql_update_statistics_statement: ($) =>
    seq(
      kw("UPDATE"),
      kw("STATISTICS"),
      optional(field("body", $.__sql_tail)),
      $._terminator,
    ),

  __sql_tail: ($) => repeat1($.__sql_token),
  __sql_value: ($) =>
    choice(
      $.__sql_name,
      $.string_literal,
      $.number_literal,
      alias($._signed_number_literal, $.number_literal),
      $.null_literal,
    ),

  __sql_name: ($) => choice($.qualified_name, $.identifier),
  __sql_procedure_name: ($) =>
    choice($.qualified_name, $.identifier, $.string_literal),

  __sql_keyword: ($) =>
    choice(
      kw("ADD"),
      kw("AS"),
      kw("BY"),
      kw("COLUMN"),
      kw("COMMITTED"),
      kw("DELETE"),
      kw("EACH"),
      kw("EXCLUSIVE"),
      kw("FOR"),
      kw("FROM"),
      kw("IN"),
      kw("INCREMENT"),
      kw("MODE"),
      kw("ON"),
      kw("PASSWORD"),
      kw("POLICY"),
      kw("READ"),
      kw("ROW"),
      kw("SELECT"),
      kw("SET"),
      kw("START"),
      kw("TO"),
      kw("USER"),
      kw("VALUES"),
      kw("VARCHAR"),
      kw("WHERE"),
      kw("WITH"),
    ),

  __sql_token: ($) =>
    choice(
      $.__sql_value,
      $.__sql_keyword,
      ",",
      "(",
      ")",
      "=",
      "<",
      ">",
      "<=",
      ">=",
      "<>",
      "+",
      "-",
      "*",
      "/",
      ":",
    ),
});
