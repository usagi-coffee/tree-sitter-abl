module.exports = ({ kw, tkw }) => ({
  event_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      kw("EVENT"),
      field("name", $.identifier),
      alias($.__event_signature, $.signature),
      $._terminator,
    ),

  __event_signature: ($) =>
    choice(
      // VOID signature
      seq(
        kw("SIGNATURE"),
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
    seq(
      $.__event_parameter,
      repeat(seq(",", $.__event_parameter)),
    ),

  __event_parameter: ($) =>
    seq(
      optional(choice(kw("INPUT"), kw("OUTPUT"), tkw("INPUT-OUTPUT"))),
      field("name", $.identifier),
      kw("AS"),
      optional(kw("CLASS")),
      field("type", $._type_or_string),
    ),
});
