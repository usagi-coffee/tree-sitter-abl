export default ({ kw }) => ({
  create_statement: ($) => seq(kw("CREATE"), $.__create_body, $._terminator),

  __create_body: ($) =>
    choice(
      seq(
        choice(
          $.__create_alias,
          $.__create_buffer,
          $.__create_widget_pool,
          $.__create_database,
          $.__create_automation_object,
          $.__create_record,
          $.__create_handle_with_pool_no_error_body,
        ),
        optional($.__no_error),
      ),
      $.__create_handle_with_pool_body,
      $.__create_server,
    ),
  __create_alias: ($) =>
    seq(
      kw("ALIAS"),
      field("alias", $._alias_name),
      kw("FOR"),
      kw("DATABASE"),
      field("database", $._alias_name),
    ),
  __create_buffer: ($) =>
    seq(
      kw("BUFFER"),
      // The handle is often a property of the object doing the creating, the
      // same way BUFFER-NAME below is: `CREATE BUFFER THIS-OBJECT:hTT FOR ...`.
      field("handle", choice($._identifier_or_array_access, $.object_access)),
      kw("FOR"),
      kw("TABLE"),
      field("table", $.__create_buffer_target),
      optional(
        seq(
          kw("BUFFER-NAME"),
          // The name is often a property of the object doing the creating:
          // `BUFFER-NAME THIS-OBJECT:hName`. It can also be assembled at run
          // time -- `BUFFER-NAME "n" + STRING(i)` compiles -- so it reads the
          // same target as the table above, concatenation included, rather
          // than a name or a literal alone.
          field("name", $.__create_buffer_target),
        ),
      ),
      optional($._in_widget_pool),
    ),
  // The table is named by a character expression, so it can be assembled at run
  // time. Concatenation is spelled out here rather than reusing the expression
  // rule: that one reaches widget_qualified_name, whose separator is IN, and it
  // would then swallow the IN WIDGET-POOL option that follows.
  __create_buffer_target: ($) =>
    choice($.__create_buffer_name, alias($.__create_buffer_concatenation, $.binary_expression)),
  __create_buffer_concatenation: ($) =>
    seq($.__create_buffer_name, repeat1(seq("+", $.__create_buffer_name))),
  __create_buffer_name: ($) =>
    choice($._identifier_or_access_or_call, $.string_literal, $.parenthesized_expression),
  __create_handle_with_pool_no_error_body: ($) =>
    seq(
      choice(kw("CALL"), kw("QUERY"), kw("SAX-READER"), kw("SAX-WRITER"), kw("SAX-ATTRIBUTES")),
      $._handle_in_widget_pool,
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
      $._handle_in_widget_pool,
    ),
  __create_widget_pool: ($) =>
    seq(
      kw("WIDGET-POOL"),
      optional(seq(field("pool", $.identifier), optional(alias(kw("PERSISTENT"), $.persistent)))),
    ),
  __create_server: ($) =>
    seq(kw("SERVER"), field("handle", $.identifier), optional($.assign_phrase)),
  __create_database: ($) =>
    seq(
      kw("DATABASE"),
      field("new_database", $._expression),
      optional(
        seq(
          kw("FROM"),
          field("old_database", $._expression),
          optional(alias(kw("NEW-INSTANCE"), $.new_instance)),
        ),
      ),
      optional(alias(kw("REPLACE"), $.replace)),
    ),
  __create_automation_object: ($) =>
    seq(
      field("progid", $._expression),
      field("handle", $.identifier),
      optional(seq(kw("CONNECT"), optional(seq(kw("TO"), field("target", $._expression))))),
    ),
  __create_record: ($) =>
    seq(
      field("table", choice($._identifier_or_qualified_name, $.preprocessor_name)),
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
    ),
  __create_record_locator_rowid: ($) => seq("(", field("rowid", $._expression), ")"),
  __create_record_locator_recid: ($) => seq("(", field("recid", $._expression), ")"),
});
