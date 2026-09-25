export default ({ kw }) => ({
  variable_definition: ($) => seq($.__variable_prefix, $._terminator),

  __variable_prefix: ($) =>
    seq(
      $._define_keyword,
      optional($.__variable_modifier),
      kw("VARIABLE", { offset: 3 }),
      $.__variable_body,
    ),

  __variable_body: ($) =>
    seq(
      field("name", $.identifier),
      optional($.__variable_extents),
      optional(alias($._no_undo_keyword, $.no_undo)),
      choice(
        seq($._as_keyword, $._class_type),
        seq($._like_keyword, field("like", $._identifier_or_array_access)),
      ),

      optional($.__variable_options),
    ),
  __variable_options: ($) => prec.right(seq($.__variable_option, optional($.__variable_options))),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __variable_option: ($) =>
    choice(
      alias($.__variable_extent_phrase, $.extent_phrase),
      seq(kw("SERIALIZE-NAME"), field("serialize_name", $._identifier_or_string_literal)),
      alias($._format_string, $.format_phrase),
      $._color_font_option,
      seq(kw("COLUMN-LABEL"), field("column_label", $._format_labels)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_context_help_id, field("context_help_id", $._expression)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("DECIMALS"), field("decimals", $.number_literal)),
      alias(kw("DROP-TARGET"), $.drop_target),
      seq(kw("LABEL"), field("label", $._format_labels)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("MOUSE-POINTER"), field("mouse_pointer", $._expression)),
      $._initial_phrase,
      $.view_as_phrase,
      alias(seq(optional(kw("NOT")), kw("CASE-SENSITIVE")), $.case_sensitive),
      alias($._no_undo_keyword, $.no_undo),
      $.trigger_phrase,
    ),

  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
  __variable_extent_phrase: ($) =>
    seq(
      kw("EXTENT"),
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      optional(field("size", choice($.number_literal, $.preprocessor_name, $.identifier))),
    ),
  __variable_extents: ($) =>
    prec.right(
      // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
      seq(alias($.__variable_extent_phrase, $.extent_phrase), optional($.__variable_extents)),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __variable_modifier: ($) =>
    choice(
      seq(
        alias($._new_keyword, $.new_modifier),
        optional(alias(kw("GLOBAL"), $.scope_modifier)),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        alias(kw("SHARED"), $.scope_modifier),
      ),
      // A {&NEWGLOBAL}-style macro can stand in for the whole "NEW GLOBAL"
      // phrase, with SHARED still spelled out afterward.
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      seq($.preprocessor_name, alias(kw("SHARED"), $.scope_modifier)),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("SHARED"), $.scope_modifier),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        $._member_access_modifier,
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        optional(alias(kw("STATIC"), $.static_modifier)),
        optional($._serialization_modifier),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        alias(kw("STATIC"), $.static_modifier),
        optional($._member_access_modifier),
        optional($._serialization_modifier),
      ),
      $._serialization_modifier,
    ),
});
