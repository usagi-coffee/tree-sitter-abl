module.exports = ({ kw }) => ({
  interface_definition: ($) => seq(kw("INTERFACE"), $.__interface_body, $._terminator),

  __interface_body: ($) =>
    seq(
      field("name", $._type_name),
      optional(seq(kw("INHERITS"), $.__interface_inherits_list)),
      $.__interface_compound_body,
    ),
  __interface_compound_body: ($) =>
    seq(
      choice(alias($._colon, ":"), $._terminator_dot),
      repeat(alias($.__interface_body_item, $.interface_body_item)),
      kw("END"),
      optional(kw("INTERFACE")),
    ),

  __interface_inherits_list: ($) =>
    seq(field("super", $._type_name), repeat(seq(",", field("super", $._type_name)))),

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
      $.include_file_reference,
    ),

  __interface_temp_table: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      kw("TEMP-TABLE"),
      $._table_body,
      repeat(
        choice(
          alias($._table_field, $.temp_table_field),
          alias($._table_index, $.temp_table_index),
        ),
      ),
      $._terminator,
    ),

  __interface_dataset: ($) =>
    seq(kw("DEFINE", { offset: 3 }), kw("DATASET"), $._dataset_body, $._terminator),

  __interface_event: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional(alias(kw("PUBLIC"), $.access_modifier)),
      kw("EVENT"),
      $._event_body,
      $._terminator,
    ),

  interface_method_definition: ($) =>
    seq(
      kw("METHOD"),
      repeat($._method_modifier_no_abstract),
      $._method_return_type,
      field("name", $.identifier),
      alias($._method_parameters, $.parameters),
      $._terminator_dot,
    ),
});
