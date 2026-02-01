module.exports = ({ kw }) => ({
  variable_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(
        choice(
          alias($.__variable_shared_variable_scope, $.shared_variable_scope),
          seq(
            optional(alias($.__variable_access_modifier, $.access_modifier)),
            optional(alias($.__variable_static_modifier, $.static_modifier)),
            optional(
              alias(
                $.__variable_serialization_modifier,
                $.serialization_modifier,
              ),
            ),
          ),
        ),
      ),
      choice(kw("VARIABLE"), kw("VAR")),
      $.__variable_body,
      $._terminator,
    ),

  __variable_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($.__variable_no_undo, $.no_undo)),
      $._variable_type_phrase,
      repeat(
        choice(
          alias($.__variable_serialize_name_option, $.serialize_name_option),
          alias($.__variable_bgcolor_option, $.bgcolor_option),
          alias($.__variable_column_label_option, $.column_label_option),
          alias($.__variable_context_help_id_option, $.context_help_id_option),
          alias($.__variable_dcolor_option, $.dcolor_option),
          alias($.__variable_decimals_option, $.decimals_option),
          alias($.__variable_drop_target_option, $.drop_target_option),
          alias($.__variable_extent_phrase, $.extent_phrase),
          alias($.__variable_font_option, $.font_option),
          alias($.__variable_fgcolor_option, $.fgcolor_option),
          alias($.__variable_initial_option, $.initial_option),
          alias($.__variable_label_option, $.label_option),
          alias($.__variable_mouse_pointer_option, $.mouse_pointer_option),
          alias($.__variable_no_undo, $.no_undo),
          alias($.__variable_case_sensitive_option, $.case_sensitive_option),
          alias($.__variable_pfcolor_option, $.pfcolor_option),
          alias($.__variable_view_as_phrase, $.view_as_phrase),
          $.trigger_phrase,
          $.format_phrase,
        ),
      ),
    ),

  __variable_shared_variable_scope: ($) =>
    choice(
      seq(kw("NEW"), kw("GLOBAL"), kw("SHARED")),
      seq(kw("NEW"), kw("SHARED")),
      kw("SHARED"),
    ),
  __variable_access_modifier: ($) =>
    choice(
      kw("PRIVATE"),
      kw("PACKAGE-PRIVATE"),
      kw("PROTECTED"),
      kw("PACKAGE-PROTECTED"),
      kw("PUBLIC"),
    ),

  _variable_type_phrase: ($) =>
    seq(
      choice(
        seq(kw("AS"), optional(kw("CLASS")), field("type", $._type_or_string)),
        seq(kw("LIKE"), field("like", $.__variable_field_name)),
      ),
    ),

  __variable_initial_option: ($) =>
    seq(
      $.__variable_initial_keyword,
      field(
        "value",
        choice($._expression, seq("[", optional($._expressions), "]")),
      ),
    ),

  __variable_static_modifier: ($) => kw("STATIC"),
  __variable_serialization_modifier: ($) =>
    choice(kw("SERIALIZABLE"), kw("NON-SERIALIZABLE")),
  __variable_extent_phrase: ($) =>
    seq(kw("EXTENT"), optional($.__variable_extent_size)),
  __variable_serialize_name_option: ($) =>
    seq(kw("SERIALIZE-NAME"), field("name", $._name_or_string)),
  _name_or_string: ($) => choice($.identifier, $.string_literal),
  __variable_bgcolor_option: ($) => seq(kw("BGCOLOR"), $._expression),
  __variable_column_label_option: ($) =>
    seq(kw("COLUMN-LABEL"), $.__variable_label_list),
  __variable_context_help_id_option: ($) =>
    seq(kw("CONTEXT-HELP-ID"), $._expression),
  __variable_dcolor_option: ($) => seq(kw("DCOLOR"), $._expression),
  __variable_decimals_option: ($) => seq(kw("DECIMALS"), $.number_literal),
  __variable_drop_target_option: ($) => kw("DROP-TARGET"),
  __variable_font_option: ($) => seq(kw("FONT"), $._expression),
  __variable_fgcolor_option: ($) => seq(kw("FGCOLOR"), $._expression),
  __variable_label_option: ($) => seq(kw("LABEL"), $.__variable_label_list),
  __variable_pfcolor_option: ($) => seq(kw("PFCOLOR"), $._expression),
  __variable_view_as_phrase: ($) =>
    seq(
      kw("VIEW-AS"),
      field("widget", $.identifier),
      repeat($.__variable_view_as_option),
    ),
  __variable_view_as_option: ($) =>
    choice(
      kw("HORIZONTAL"),
      kw("VERTICAL"),
      kw("SINGLE"),
      kw("MULTIPLE"),
      seq(kw("LIST-ITEMS"), $.__variable_list_items),
      seq(kw("RADIO-BUTTONS"), $.__variable_radio_buttons),
      seq(kw("SIZE"), $._expression, kw("BY"), $._expression),
      kw("SCROLLBAR-VERTICAL"),
      kw("NO-DRAG"),
    ),
  __variable_no_undo: ($) => kw("NO-UNDO"),
  __variable_mouse_pointer_option: ($) =>
    seq(kw("MOUSE-POINTER"), $._expression),
  __variable_case_sensitive_option: ($) =>
    seq(optional(kw("NOT")), kw("CASE-SENSITIVE")),
  __variable_extent_size: ($) =>
    choice(
      $.number_literal,
      alias($.constant_expression, $.constant),
      $.identifier,
    ),
  __variable_list_items: ($) =>
    seq($._expression, repeat(seq(",", $._expression))),
  __variable_radio_buttons: ($) =>
    seq($.__variable_radio_button, repeat(seq(",", $.__variable_radio_button))),
  __variable_radio_button: ($) => seq($._expression, ",", $._expression),
  __variable_label_list: ($) =>
    seq($.string_literal, repeat(seq(",", $.string_literal))),
  __variable_field_name: ($) => choice($.qualified_name, $.identifier),
  __variable_initial_keyword: ($) =>
    choice(kw("INITIAL"), alias(token(seq(/INIT(IAL)?/i, /\s+/)), "INITIAL")),
});
