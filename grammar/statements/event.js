export default ({ kw }) => ({
  event_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__event_modifier),
      kw("EVENT"),
      $._event_body,
      $._terminator,
    ),

  __event_signature: ($) =>
    choice(
      // VOID signature
      seq(optional(kw("SIGNATURE")), kw("VOID"), "(", optional($.__event_parameter_list), ")"),
      // DELEGATE signature
      seq(kw("DELEGATE"), optional(kw("CLASS")), field("delegate_type", $._type_or_string)),
    ),

  __event_parameter_list: ($) => seq($.__event_parameter, repeat(seq(",", $.__event_parameter))),

  __event_parameter: ($) =>
    seq(
      optional(field("direction", $._parameter_direction)),
      field("name", $.identifier),
      kw("AS"),
      optional(kw("CLASS")),
      field("type", $._type_or_string),
    ),
  __event_modifier: ($) =>
    choice(
      seq(
        $._member_access_modifier,
        repeat($.__event_type_modifier),
        optional(alias(kw("OVERRIDE"), $.override_modifier)),
      ),
      seq(
        repeat1($.__event_type_modifier),
        optional($._member_access_modifier),
        optional(alias(kw("OVERRIDE"), $.override_modifier)),
      ),
      alias(kw("OVERRIDE"), $.override_modifier),
    ),
  __event_type_modifier: ($) =>
    choice(alias(kw("STATIC"), $.static_modifier), alias(kw("ABSTRACT"), $.abstract_modifier)),
});
