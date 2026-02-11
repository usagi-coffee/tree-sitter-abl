module.exports = ({ kw }) => ({
  variable_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__variable_modifier),
      kw("VARIABLE", { offset: 3 }),
      $.__variable_body,
      $._terminator,
    ),

  __variable_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat(alias($.__variable_extent_phrase, $.extent_phrase)),
      optional(alias(kw("NO-UNDO"), $.no_undo)),
      choice(
        seq(
          kw("AS"),
          optional(kw("CLASS")),
          field("type", $._type_or_string),
        ),
        seq(kw("LIKE"), field("like", $._identifier_or_qualified_name)),
      ),

      repeat(
        choice(
          alias($.__variable_extent_phrase, $.extent_phrase),
          seq(
            kw("SERIALIZE-NAME"),
            field("serialize_name", choice($.identifier, $.string_literal)),
          ),
          alias($.__variable_format_phrase, $.format_phrase),
          seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
          seq(kw("COLUMN-LABEL"), field("column_label", $.__format_labels)),
          seq(kw("CONTEXT-HELP-ID"), field("context_help_id", $._expression)),
          seq(kw("DCOLOR"), field("dcolor", $._expression)),
          seq(kw("DECIMALS"), field("decimals", $.number_literal)),
          alias(kw("DROP-TARGET"), $.drop_target),
          seq(kw("FONT"), field("font", $._expression)),
          seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
          seq(kw("LABEL"), field("label", $.__format_labels)),
          seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
          seq(kw("MOUSE-POINTER"), field("mouse_pointer", $._expression)),
          seq(
            kw("INITIAL", { offset: 4 }),
            field("initial", choice($._expression, seq("[", optional($._expressions), "]"))),
          ),
          $.view_as_phrase,
          alias(seq(optional(kw("NOT")), kw("CASE-SENSITIVE")), $.case_sensitive),
          alias(kw("NO-UNDO"), $.no_undo),
          $.trigger_phrase,
        ),
      ),
    ),

  __variable_extent_size: ($) =>
    choice(
      $.number_literal,
      alias($.constant_expression, $.preprocessor_reference),
      $.identifier,
    ),

  __variable_list_items: ($) =>
    seq($._expression, repeat(seq(",", $._expression))),

  __variable_radio_buttons: ($) =>
    seq($.__variable_radio_button, repeat(seq(",", $.__variable_radio_button))),

  __variable_radio_button: ($) => seq($._expression, ",", $._expression),

  __variable_extent_phrase: ($) =>
    seq(kw("EXTENT"), optional(field("size", $.__variable_extent_size))),

  __variable_format_phrase: ($) =>
    seq(kw("FORMAT", { offset: 4 }), field("format", $.string_literal)),

  __variable_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        optional(alias(kw("GLOBAL"), $.scope_modifier)),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      seq(
        choice(
          alias(kw("PRIVATE"), $.access_modifier),
          alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
          alias(kw("PROTECTED"), $.access_modifier),
          alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
          alias(kw("PUBLIC"), $.access_modifier),
        ),
        optional(alias(kw("STATIC"), $.static_modifier)),
        optional($.__variable_serialization_modifier),
      ),
      seq(
        alias(kw("STATIC"), $.static_modifier),
        optional(
          choice(
            alias(kw("PRIVATE"), $.access_modifier),
            alias(kw("PACKAGE-PRIVATE"), $.access_modifier),
            alias(kw("PROTECTED"), $.access_modifier),
            alias(kw("PACKAGE-PROTECTED"), $.access_modifier),
            alias(kw("PUBLIC"), $.access_modifier),
          ),
        ),
        optional($.__variable_serialization_modifier),
      ),
      $.__variable_serialization_modifier,
    ),
  __variable_serialization_modifier: ($) =>
    choice(
      alias(kw("SERIALIZABLE"), $.serialization_modifier),
      alias(kw("NON-SERIALIZABLE"), $.serialization_modifier),
    ),
});
