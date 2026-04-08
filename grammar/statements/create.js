module.exports = ({ kw }) => ({
  create_statement: ($) => seq(kw("CREATE"), $.__create_body, $._terminator),

  __create_body: ($) =>
    choice(
      $.__create_alias,
      $.__create_buffer,
      $.__create_handle_with_pool_no_error_body,
      $.__create_handle_with_pool_body,
      $.__create_widget_pool,
      $.__create_server,
      $.__create_database,
      $.__create_automation_object,
      $.__create_record,
    ),
  __create_alias: ($) =>
    seq(
      kw("ALIAS"),
      field("alias", $._alias_name),
      kw("FOR"),
      kw("DATABASE"),
      field("database", $._alias_name),
      optional($.__create_no_error),
    ),
  __create_buffer: ($) =>
    seq(
      kw("BUFFER"),
      field("handle", $.identifier),
      kw("FOR"),
      kw("TABLE"),
      field("table", $.__create_buffer_target),
      optional(seq(kw("BUFFER-NAME"), field("name", $.identifier))),
      optional($._in_widget_pool),
      optional($.__create_no_error),
    ),
  __create_buffer_target: ($) => choice($._identifier_or_access_or_call, $.string_literal),
  __create_handle_with_pool_no_error_body: ($) =>
    seq(
      choice(kw("CALL"), kw("QUERY"), kw("SAX-READER"), kw("SAX-WRITER"), kw("SAX-ATTRIBUTES")),
      $.__create_handle_in_widget_pool_no_error,
    ),
  __create_handle_with_pool_body: ($) =>
    seq(
      choice(
        kw("CLIENT-PRINCIPAL"),
        kw("DATA-SOURCE"),
        kw("DATASET"),
        kw("X-DOCUMENT"),
        kw("X-NODEREF"),
        kw("SOAP-HEADER"),
        kw("SOAP-HEADER-ENTRYREF"),
      ),
      $.__create_handle_in_widget_pool,
    ),
  __create_widget_pool: ($) =>
    seq(kw("WIDGET-POOL"), optional($.__create_widget_pool_name), optional($.__create_no_error)),
  __create_widget_pool_name: ($) =>
    seq(field("pool", $.identifier), optional(alias(kw("PERSISTENT"), $.persistent))),
  __create_server: ($) =>
    seq(kw("SERVER"), field("handle", $.identifier), optional($.assign_phrase)),
  __create_database: ($) =>
    seq(
      kw("DATABASE"),
      field("new_database", $._expression),
      optional($.__create_database_from),
      optional(alias(kw("REPLACE"), $.replace)),
      optional($.__create_no_error),
    ),
  __create_database_from: ($) =>
    seq(
      kw("FROM"),
      field("old_database", $._expression),
      optional(alias(kw("NEW-INSTANCE"), $.new_instance)),
    ),
  __create_automation_object: ($) =>
    seq(
      field("progid", $._expression),
      field("handle", $.identifier),
      optional(seq(kw("CONNECT"), optional(seq(kw("TO"), field("target", $._expression))))),
      optional($.__create_no_error),
    ),
  __create_record: ($) =>
    seq(
      field("table", $._identifier_or_qualified_name),
      optional(seq(kw("FOR"), kw("TENANT"), field("tenant", $._expression))),
      optional(
        seq(
          kw("USING"),
          choice(
            seq(kw("ROWID"), $.__create_record_locator_rowid),
            seq(kw("RECID"), $.__create_record_locator_recid),
          ),
        ),
      ),
      optional($.__create_no_error),
    ),
  __create_record_locator_rowid: ($) => seq("(", field("rowid", $._expression), ")"),
  __create_record_locator_recid: ($) => seq("(", field("recid", $._expression), ")"),
  __create_handle_in_widget_pool: ($) =>
    seq(field("handle", $.identifier), optional($._in_widget_pool)),
  __create_handle_in_widget_pool_no_error: ($) =>
    seq($.__create_handle_in_widget_pool, optional($.__create_no_error)),
  __create_no_error: ($) => alias(kw("NO-ERROR"), $.no_error),
});
