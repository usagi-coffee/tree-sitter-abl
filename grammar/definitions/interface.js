module.exports = ({ kw, tkw }) => ({
  interface_definition: ($) =>
    seq(
      kw("INTERFACE"),
      field("name", $._type_name),
      choice($._colon, $._terminator_dot),
      repeat($.interface_body_item),
      tkw("END"),
      optional(tkw("INTERFACE")),
      $._terminator,
    ),

  interface_body_item: ($) =>
    choice(
      alias($.interface_method_definition, $.method_definition),
      $.property_definition,
      $.preprocessor_directive,
      $.include,
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
