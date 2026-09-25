export default ({ kw }) => ({
  create_statement: ($) => seq($._kw_create, $.__create_body, $._terminator),

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
      $._kw_alias,
      field("alias", $._alias_name),
      $._kw_for,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("DATABASE"),
      field("database", $._alias_name),
    ),
  __create_buffer: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_buffer,
      field("handle", $._identifier_or_access),
      $._kw_for,
      $._kw_table,
      field("table", $.__create_buffer_target),
      optional(seq(kw("BUFFER-NAME"), field("name", $.__create_buffer_target))),
      optional($._in_widget_pool),
    ),
  __create_buffer_target: ($) =>
    choice($.__create_buffer_name, alias($.__create_buffer_concatenation, $.binary_expression)),
  __create_buffer_concatenation: ($) =>
    seq($.__create_buffer_name, $.__create_buffer_concatenation_tail),
  __create_buffer_concatenation_tail: ($) =>
    prec.right(seq("+", $.__create_buffer_name, optional($.__create_buffer_concatenation_tail))),
  // oxlint-disable-next-line tree-sitter-optimize/multi-use-private-choice-inline
  __create_buffer_name: ($) =>
    choice(
      $._identifier_or_access_or_call,
      $.string_literal,
      $.parenthesized_expression,
      $.conditional_expression,
    ),
  __create_handle_with_pool_no_error_body: ($) =>
    seq(
      choice($._kw_call, $._kw_query, kw("SAX-READER"), kw("SAX-WRITER"), kw("SAX-ATTRIBUTES")),
      $._handle_in_widget_pool,
    ),
  __create_handle_with_pool_body: ($) =>
    seq(
      choice(
        kw("CLIENT-PRINCIPAL"),
        $._kw_data_source,
        $._dataset_keyword,
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
      optional(
        seq(
          field("pool", $._identifier_or_string_literal),
          optional(alias(kw("PERSISTENT"), $.persistent)),
        ),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence, tree-sitter-optimize/single-use-sequence
  __create_server: ($) =>
    seq($._kw_server, field("handle", $.identifier), optional($.assign_phrase)),
  __create_database: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("DATABASE"),
      field("new_database", $._expression),
      optional(
        seq(
          $._kw_from,
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
      optional(seq($._kw_connect, optional(seq($._kw_to, field("target", $._expression))))),
    ),
  __create_record: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      field("table", choice($._qualified_identifier, $.preprocessor_name)),
      optional($._for_tenant),
      optional(
        seq(
          $._using_keyword,
          choice(
            seq($._kw_rowid, $.__create_record_locator_rowid),
            seq($._kw_recid, $.__create_record_locator_recid),
          ),
        ),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __create_record_locator_rowid: ($) => seq("(", field("rowid", $._expression), ")"),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __create_record_locator_recid: ($) => seq("(", field("recid", $._expression), ")"),
});
