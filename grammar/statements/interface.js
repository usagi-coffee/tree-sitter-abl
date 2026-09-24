export default ({ kw }) => ({
  interface_definition: ($) => seq($.__interface_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __interface_prefix: ($) => seq($._kw_interface, $.__interface_body),

  __interface_body: ($) =>
    seq(
      field("name", $._type_name),
      optional(
        // oxlint-disable-next-line tree-sitter-optimize/list-head-extraction
        seq(kw("INHERITS"), field("super", $._type_name), optional($.__interface_inherits_tail)),
      ),
      $.__interface_compound_body,
    ),
  __interface_compound_body: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      choice(alias($._colon, ":"), $._terminator_dot),
      optional($.__interface_body_items),
      $._end_keyword,
      optional($._kw_interface),
    ),

  __interface_body_items: ($) =>
    prec.right(
      seq(
        alias($.__interface_body_item, $.interface_body_item),
        optional($.__interface_body_items),
      ),
    ),

  __interface_inherits_tail: ($) =>
    seq(",", field("super", $._type_name), optional($.__interface_inherits_tail)),

  __interface_body_item: ($) =>
    choice(
      alias($.interface_method_definition, $.method_definition),
      $.property_definition,
      alias($.__interface_temp_table, $.temp_table_definition),
      alias($.__interface_dataset, $.dataset_definition),
      alias($.__interface_event, $.event_definition),
      $.global_define_preprocessor_directive,
      $.scoped_define_preprocessor_directive,
      $._if_preprocessor_statement,
      $.message_preprocessor_directive,
      $.undefine_preprocessor_directive,
      $.include_file_reference,
    ),

  __interface_temp_table: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/optional-body-extraction
    seq(
      $._define_keyword,
      kw("TEMP-TABLE"),
      $._table_body,
      optional($._temp_table_items),
      $._terminator,
    ),

  __interface_dataset: ($) =>
    seq($._define_keyword, $._dataset_keyword, $._dataset_body, $._terminator),

  __interface_event: ($) =>
    seq($._define_keyword, optional(alias(kw("PUBLIC"), $.access_modifier)), $._event_tail),

  interface_method_definition: ($) => seq(kw("METHOD"), $._method_header, $._terminator_dot),
});
