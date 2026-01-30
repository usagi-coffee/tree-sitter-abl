module.exports = ({ kw, tkw }) => ({
  interface_definition: ($) =>
    seq(kw("INTERFACE"), $.__interface_body, $._terminator),

  __interface_body: ($) =>
    seq(
      field("name", $._type_name),
      optional(seq(tkw("INHERITS"), $.__interface_inherits_list)),
      choice($._colon, $._terminator_dot),
      repeat(alias($.__interface_body_item, $.interface_body_item)),
      tkw("END"),
      optional(tkw("INTERFACE")),
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
      $.preprocessor_directive,
      alias($.include_expression, $.include),
    ),

  __interface_temp_table: ($) =>
    seq(choice(kw("DEFINE"), kw("DEF")), kw("TEMP-TABLE"), $.__temp_table_body, $._terminator),

  __interface_dataset: ($) =>
    seq(choice(kw("DEFINE"), kw("DEF")), kw("DATASET"), $.__dataset_body, $._terminator),

  __interface_event: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      repeat($.__event_modifier),
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
