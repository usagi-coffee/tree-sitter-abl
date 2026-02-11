module.exports = ({ kw }) => ({
  create_statement: ($) => seq(kw("CREATE"), $.__create_body, $._terminator),

  __create_body: ($) =>
    choice(
      prec(1, $.__create_alias),
      prec(1, $.__create_buffer),
      prec(1, $.__create_call),
      prec(1, $.__create_client_principal),
      prec(1, $.__create_data_source),
      prec(1, $.__create_dataset),
      prec(1, $.__create_query),
      prec(1, $.__create_x_document),
      prec(1, $.__create_x_noderef),
      prec(1, $.__create_soap_header),
      prec(1, $.__create_soap_header_entryref),
      prec(1, $.__create_sax_reader),
      prec(1, $.__create_sax_writer),
      prec(1, $.__create_sax_attributes),
      prec(1, $.__create_widget_pool),
      prec(1, $.__create_server),
      prec(1, $.__create_database),
      $.__create_automation_object,
      $.__create_record,
    ),
  __create_alias: ($) =>
    seq(
      kw("ALIAS"),
      field("alias", $.__create_alias_name),
      kw("FOR"),
      kw("DATABASE"),
      field("database", $.__create_alias_name),
      optional(kw("NO-ERROR")),
    ),
  __create_alias_name: ($) =>
    choice(
      $.identifier,
      $.string_literal,
      seq(kw("VALUE"), "(", field("value", $._expression), ")"),
    ),
  __create_buffer: ($) =>
    seq(
      kw("BUFFER"),
      field("handle", $.identifier),
      kw("FOR"),
      kw("TABLE"),
      field("table", $.__create_buffer_target),
      optional(seq(kw("BUFFER-NAME"), field("name", $.identifier))),
      optional($.__create_in_widget_pool),
      optional(kw("NO-ERROR")),
    ),
  __create_buffer_target: ($) =>
    choice(
      $._identifier_or_qualified_name,
      $.object_access,
      $.function_call,
      $.identifier,
      $.string_literal,
    ),
  __create_call: ($) =>
    seq(
      kw("CALL"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
      optional(kw("NO-ERROR")),
    ),
  __create_client_principal: ($) =>
    seq(
      kw("CLIENT-PRINCIPAL"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
    ),
  __create_data_source: ($) =>
    seq(
      kw("DATA-SOURCE"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
    ),
  __create_dataset: ($) =>
    seq(
      kw("DATASET"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
    ),
  __create_query: ($) =>
    seq(
      kw("QUERY"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
      optional(kw("NO-ERROR")),
    ),
  __create_x_document: ($) =>
    seq(
      kw("X-DOCUMENT"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
    ),
  __create_x_noderef: ($) =>
    seq(
      kw("X-NODEREF"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
    ),
  __create_soap_header: ($) =>
    seq(
      kw("SOAP-HEADER"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
    ),
  __create_soap_header_entryref: ($) =>
    seq(
      kw("SOAP-HEADER-ENTRYREF"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
    ),
  __create_sax_reader: ($) =>
    seq(
      kw("SAX-READER"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
      optional(kw("NO-ERROR")),
    ),
  __create_sax_writer: ($) =>
    seq(
      kw("SAX-WRITER"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
      optional(kw("NO-ERROR")),
    ),
  __create_sax_attributes: ($) =>
    seq(
      kw("SAX-ATTRIBUTES"),
      field("handle", $.identifier),
      optional($.__create_in_widget_pool),
      optional(kw("NO-ERROR")),
    ),
  __create_widget_pool: ($) =>
    seq(
      kw("WIDGET-POOL"),
      optional(
        seq(field("pool", $.identifier), optional(kw("PERSISTENT"))),
      ),
      optional(kw("NO-ERROR")),
    ),
  __create_server: ($) =>
    seq(
      kw("SERVER"),
      field("handle", $.identifier),
      optional($.assign_phrase),
    ),
  __create_database: ($) =>
    seq(
      kw("DATABASE"),
      field("new_database", $._expression),
      optional(
        seq(
          kw("FROM"),
          field("old_database", $._expression),
          optional(kw("NEW-INSTANCE")),
        ),
      ),
      optional(kw("REPLACE")),
      optional(kw("NO-ERROR")),
    ),
  __create_automation_object: ($) =>
    seq(
      field("progid", $._expression),
      field("handle", $.identifier),
      optional(
        seq(
          kw("CONNECT"),
          optional(seq(kw("TO"), field("target", $._expression))),
        ),
      ),
      optional(kw("NO-ERROR")),
    ),
  __create_record: ($) =>
    seq(
      field("table", $.__create_record_name),
      optional(seq(kw("FOR"), kw("TENANT"), field("tenant", $._expression))),
      optional(
        seq(
          kw("USING"),
          choice(
            seq(kw("ROWID"), "(", field("rowid", $._expression), ")"),
            seq(kw("RECID"), "(", field("recid", $._expression), ")"),
          ),
        ),
      ),
      optional(kw("NO-ERROR")),
    ),
  __create_in_widget_pool: ($) =>
    seq(kw("IN"), kw("WIDGET-POOL"), field("pool", $.identifier)),
  __create_record_name: ($) => $._identifier_or_qualified_name,
});
