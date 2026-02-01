module.exports = ({ kw }) => ({
  event_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      repeat($.__event_modifier),
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
      optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
      field("name", $.identifier),
      kw("AS"),
      optional(kw("CLASS")),
      field("type", $._type_or_string),
    ),
  __event_modifier: ($) =>
    choice(
      alias($.__event_access_modifier, $.access_modifier),
      alias($.__event_static_modifier, $.static_modifier),
      alias($.__event_abstract_modifier, $.abstract_modifier),
      alias($.__event_override_modifier, $.override_modifier),
    ),
  __event_access_modifier: ($) =>
    choice(
      kw("PRIVATE"),
      kw("PACKAGE-PRIVATE"),
      kw("PROTECTED"),
      kw("PACKAGE-PROTECTED"),
      kw("PUBLIC"),
    ),
  __event_static_modifier: ($) => kw("STATIC"),
  __event_abstract_modifier: ($) => kw("ABSTRACT"),
  __event_override_modifier: ($) => kw("OVERRIDE"),
});
