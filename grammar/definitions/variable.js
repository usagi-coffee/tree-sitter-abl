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
      field("name", $.identifier),
      $._variable_type_clause,
      repeat(
        choice(
          alias($.__variable_serialize_name_option, $.serialize_name_option),
          alias($.__variable_bgcolor_option, $.bgcolor_option),
          alias($.__variable_column_label_option, $.column_label_option),
          alias($.__variable_context_help_id_option, $.context_help_id_option),
          alias($.__variable_dcolor_option, $.dcolor_option),
          alias($.__variable_decimals_option, $.decimals_option),
          alias($.__variable_drop_target_option, $.drop_target_option),
          alias($.__variable_font_option, $.font_option),
          alias($.__variable_fgcolor_option, $.fgcolor_option),
          alias($.__variable_format_option, $.format_option),
          alias($.__variable_initial_option, $.initial_option),
          alias($.__variable_label_option, $.label_option),
          alias($.__variable_mouse_pointer_option, $.mouse_pointer_option),
          alias($.__variable_no_undo, $.no_undo),
          alias($.__variable_case_sensitive_option, $.case_sensitive_option),
          alias($.__variable_pfcolor_option, $.pfcolor_option),
          alias($.__variable_view_as_phrase, $.view_as_phrase),
          alias($.__variable_trigger_phrase, $.trigger_phrase),
        ),
      ),
      $._terminator,
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

  _variable_type_clause: ($) =>
    seq(
      choice(
        seq(kw("AS"), optional(kw("CLASS")), field("type", $._type_or_string)),
        seq(kw("LIKE"), field("like", $.__variable_field_name)),
      ),
      optional(alias($.__variable_extent_clause, $.extent_clause)),
    ),

  __variable_initial_option: ($) =>
    seq(
      $.__variable_initial_keyword,
      choice($._expression, seq("[", optional($._expression_list), "]")),
    ),

  __variable_static_modifier: ($) => kw("STATIC"),
  __variable_serialization_modifier: ($) =>
    choice(kw("SERIALIZABLE"), kw("NON-SERIALIZABLE")),
  __variable_extent_clause: ($) =>
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
  __variable_drop_target_option: ($) => token(/DROP-TARGET/i),
  __variable_font_option: ($) => seq(kw("FONT"), $._expression),
  __variable_fgcolor_option: ($) => seq(kw("FGCOLOR"), $._expression),
  __variable_format_option: ($) => seq(kw("FORMAT"), $.string_literal),
  __variable_label_option: ($) => seq(kw("LABEL"), $.__variable_label_list),
  __variable_pfcolor_option: ($) => seq(kw("PFCOLOR"), $._expression),
  __variable_view_as_phrase: ($) => seq(kw("VIEW-AS"), $.identifier),
  __variable_trigger_phrase: ($) => seq(kw("ON"), $.identifier),
  __variable_no_undo: ($) => token(/NO-UNDO/i),
  __variable_mouse_pointer_option: ($) =>
    seq(kw("MOUSE-POINTER"), $._expression),
  __variable_case_sensitive_option: ($) =>
    seq(optional(kw("NOT")), token(/CASE-SENSITIVE/i)),
  __variable_extent_size: ($) =>
    choice($.number_literal, $.constant, $.identifier),
  __variable_label_list: ($) =>
    seq($.string_literal, repeat(seq(",", $.string_literal))),
  __variable_field_name: ($) => choice($.qualified_name, $.identifier),
  __variable_initial_keyword: ($) =>
    choice(kw("INITIAL"), alias(token(seq(/INIT(IAL)?/i, /\s+/)), "INITIAL")),
});
