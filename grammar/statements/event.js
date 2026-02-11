module.exports = ({ kw }) => ({
  event_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__event_modifier),
      kw("EVENT"),
      $.__event_body,
      $._terminator,
    ),

  __event_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($.__event_signature, $.signature)),
    ),

  __event_signature: ($) =>
    choice(
      // VOID signature
      seq(
        optional(kw("SIGNATURE")),
        kw("VOID"),
        "(",
        optional($.__event_parameter_list),
        ")",
      ),
      // DELEGATE signature
      seq(
        kw("DELEGATE"),
        optional(kw("CLASS")),
        field("delegate_type", $._type_or_string),
      ),
    ),

  __event_parameter_list: ($) =>
    seq($.__event_parameter, repeat(seq(",", $.__event_parameter))),

  __event_parameter: ($) =>
    seq(
      optional(field("direction", choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT")))),
      field("name", $.identifier),
      kw("AS"),
      optional(kw("CLASS")),
      field("type", $._type_or_string),
    ),
  __event_modifier: ($) =>
    choice(
      seq(
        $.__event_access_modifier,
        repeat($.__event_type_modifier),
        optional(alias(kw("OVERRIDE"), $.override_modifier)),
      ),
      seq(
        repeat1($.__event_type_modifier),
        optional($.__event_access_modifier),
        optional(alias(kw("OVERRIDE"), $.override_modifier)),
      ),
      alias(kw("OVERRIDE"), $.override_modifier),
    ),
  __event_access_modifier: ($) =>
    choice(
      alias(kw("PRIVATE"), $.access_modifier),
      alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
      alias(kw("PROTECTED"), $.access_modifier),
      alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
      alias(kw("PUBLIC"), $.access_modifier),
    ),
  __event_type_modifier: ($) =>
    choice(
      alias(kw("STATIC"), $.static_modifier),
      alias(kw("ABSTRACT"), $.abstract_modifier),
    ),
});
