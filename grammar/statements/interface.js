module.exports = ({ kw, tkw }) => ({
  interface_definition: ($) =>
    seq(kw("INTERFACE"), $.__interface_body, $._terminator),

  __interface_body: ($) =>
    seq(
      field("name", $._type_name),
      choice($._colon, $._terminator_dot),
      repeat($.interface_body_item),
      tkw("END"),
      optional(tkw("INTERFACE")),
    ),

  interface_body_item: ($) =>
    choice(
      alias($.interface_method_definition, $.method_definition),
      $.property_definition,
      $.preprocessor_directive,
      alias($.include_expression, $.include),
    ),

  interface_method_definition: ($) =>
    seq(
      kw("METHOD"),
      repeat($.__method_modifier_no_abstract),
      $.__method_return_type,
      field("name", $.identifier),
      $.method_parameter_list,
      $._terminator_dot,
    ),
});
