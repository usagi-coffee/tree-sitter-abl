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
      $.method_definition,
      $.property_definition,
      $.preprocessor_directive,
      $.include,
    ),
});
