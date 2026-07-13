module.exports = ({ kw }) => ({
  variable_definition: ($) => seq($.__variable_prefix, $._terminator),

  __variable_prefix: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__variable_modifier),
      kw("VARIABLE", { offset: 3 }),
      $.__variable_body,
    ),

  __variable_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat(alias($.__variable_extent_phrase, $.extent_phrase)),
      optional(alias(kw("NO-UNDO"), $.no_undo)),
      choice(
        seq(kw("AS"), optional(kw("CLASS")), field("type", $._type_or_string)),
        seq(kw("LIKE"), field("like", $._identifier_or_array_access)),
      ),

      repeat(
        choice(
          alias($.__variable_extent_phrase, $.extent_phrase),
          seq(kw("SERIALIZE-NAME"), field("serialize_name", $._identifier_or_string_literal)),
          alias($.__variable_format_phrase, $.format_phrase),
          $._color_font_option,
          seq(kw("COLUMN-LABEL"), field("column_label", $._format_labels)),
          seq(kw("CONTEXT-HELP-ID"), field("context_help_id", $._expression)),
          seq(kw("DECIMALS"), field("decimals", $.number_literal)),
          alias(kw("DROP-TARGET"), $.drop_target),
          seq(kw("LABEL"), field("label", $._format_labels)),
          seq(kw("MOUSE-POINTER"), field("mouse_pointer", $._expression)),
          seq(kw("INITIAL", { offset: 4 }), field("initial", $._initial_value)),
          $.view_as_phrase,
          alias(seq(optional(kw("NOT")), kw("CASE-SENSITIVE")), $.case_sensitive),
          alias(kw("NO-UNDO"), $.no_undo),
          $.trigger_phrase,
        ),
      ),
    ),

  __variable_extent_phrase: ($) =>
    seq(
      kw("EXTENT"),
      optional(field("size", choice($.number_literal, $.preprocessor_name, $.identifier))),
    ),

  __variable_format_phrase: ($) => $._format_string,

  __variable_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        optional(alias(kw("GLOBAL"), $.scope_modifier)),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      seq(
        $._member_access_modifier,
        optional(alias(kw("STATIC"), $.static_modifier)),
        optional($._serialization_modifier),
      ),
      seq(
        alias(kw("STATIC"), $.static_modifier),
        optional($._member_access_modifier),
        optional($._serialization_modifier),
      ),
      $._serialization_modifier,
    ),
});
