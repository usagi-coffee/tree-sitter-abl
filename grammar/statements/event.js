export default ({ kw }) => ({
  event_definition: ($) => seq($._define_keyword, optional($.__event_modifier), $._event_tail),

  __event_signature: ($) =>
    choice(
      // VOID signature
      seq(optional(kw("SIGNATURE")), kw("VOID"), "(", optional($.__event_parameter_list), ")"),
      // DELEGATE signature
      seq(kw("DELEGATE"), optional(kw("CLASS")), field("delegate_type", $._type_or_string)),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __event_parameter_list: ($) =>
    seq($.__event_parameter, optional(seq(",", $.__event_parameter_list))),

  // oxlint-disable-next-line tree-sitter-optimize/recursive-item-inline
  __event_parameter: ($) =>
    seq(
      optional(field("direction", $._parameter_direction)),
      field("name", $.identifier),
      $._as_keyword,
      $._class_type,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/single-use-choice
  __event_modifier: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        $._member_access_modifier,
        optional($.__event_type_modifiers),
        optional(alias(kw("OVERRIDE"), $.override_modifier)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        $.__event_type_modifiers,
        optional($._member_access_modifier),
        optional(alias(kw("OVERRIDE"), $.override_modifier)),
      ),
      alias(kw("OVERRIDE"), $.override_modifier),
      $.preprocessor_name,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __event_type_modifier: ($) =>
    choice(alias(kw("STATIC"), $.static_modifier), alias(kw("ABSTRACT"), $.abstract_modifier)),
  __event_type_modifiers: ($) =>
    prec.right(seq($.__event_type_modifier, optional($.__event_type_modifiers))),
});
