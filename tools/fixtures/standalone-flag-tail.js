export default grammar({
  name: "fixture",
  rules: {
    __class_property_definition_modifier: ($) =>
      choice(
        seq(
          $._member_access_modifier,
          optional($.__class_property_class_modifier),
          optional(choice($.__class_property_modifier_tail, $._serialization_modifier)),
        ),
        seq(
          $.__class_property_class_modifier,
          optional($._member_access_modifier),
          optional(choice($.__class_property_modifier_tail, $._serialization_modifier)),
        ),
        $.__class_property_modifier_tail,
        $._serialization_modifier,
      ),
    __class_property_modifier_tail: ($) =>
      seq(
        alias(kw("OVERRIDE"), $.override_modifier),
        optional($._member_access_modifier),
        optional($._serialization_modifier),
      ),
  },
});
