module.exports = ({ kw }) => ({
  interface_definition: ($) =>
    seq(kw("INTERFACE"), $.__interface_body, $._terminator),

  __interface_body: ($) =>
    seq(
      field("name", $._type_name),
      optional(seq(kw("INHERITS"), $.__interface_inherits_list)),
      choice(alias($._colon, ":"), $._terminator_dot),
      repeat(alias($.__interface_body_item, $.interface_body_item)),
      kw("END"),
      optional(kw("INTERFACE")),
    ),

  __interface_inherits_list: ($) =>
    seq(
      field("super", $._type_name),
      repeat(seq(",", field("super", $._type_name))),
    ),

  __interface_body_item: ($) =>
    choice(
      alias($.interface_method_definition, $.method_definition),
      $.property_definition,
      alias($.__interface_temp_table, $.temp_table_definition),
      alias($.__interface_dataset, $.dataset_definition),
      alias($.__interface_event, $.event_definition),
      $.global_define_preprocessor_directive,
      $.scoped_define_preprocessor_directive,
      alias($.if_preprocessor_directive_statement, $.if_preprocessor_directive),
      $.message_preprocessor_directive,
      $.undefine_preprocessor_directive,
      alias($.include_expression, $.include_reference),
    ),

  __interface_temp_table: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      kw("TEMP-TABLE"),
      $.__temp_table_body,
      $._terminator,
    ),

  __interface_dataset: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      kw("DATASET"),
      $.__dataset_body,
      $._terminator,
    ),

  __interface_event: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional(alias(kw("PUBLIC"), $.access_modifier)),
      kw("EVENT"),
      $.__event_body,
      $._terminator,
    ),

  interface_method_definition: ($) =>
    seq(
      kw("METHOD"),
      repeat($.__method_modifier_no_abstract),
      $.__method_return_type,
      field("name", $.identifier),
      alias($.__method_parameters, $.parameters),
      $._terminator_dot,
    ),
});
