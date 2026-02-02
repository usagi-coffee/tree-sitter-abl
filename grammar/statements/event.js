const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  event_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      ...definitionModifiers($, kw, {
        access: [
          "PRIVATE",
          "PACKAGE-PRIVATE",
          "PROTECTED",
          "PACKAGE-PROTECTED",
          "PUBLIC",
        ],
        static: true,
        abstract: true,
        override: true,
      }),
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
});
