const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  variable_definition: ($) =>
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
        new: true,
        scope: ["SHARED", "GLOBAL"],
        static: true,
        serializable: true,
      }),
      kw("VARIABLE", { offset: 3 }),
      $.__variable_body,
      $._terminator,
    ),

  __variable_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias(kw("NO-UNDO"), $.no_undo)),

      seq(
        choice(
          seq(
            kw("AS"),
            optional(kw("CLASS")),
            field("type", $._type_or_string),
          ),
          seq(kw("LIKE"), field("like", $._identifier_or_qualified_name)),
        ),
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
          kw("DROP-TARGET"),
          seq(kw("FONT"), field("font", $._expression)),
          seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
          seq(kw("LABEL"), field("label", $.__format_labels)),
          seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
          seq(kw("MOUSE-POINTER"), field("mouse_pointer", $._expression)),

          alias($.__variable_initial_option, $.initial_option),

          seq(
            kw("VIEW-AS"),
            field("widget", $.identifier),
            repeat(
              choice(
                kw("HORIZONTAL"),
                kw("VERTICAL"),
                kw("SINGLE"),
                kw("MULTIPLE"),
                seq(
                  kw("LIST-ITEMS"),
                  field("list_items", $.__variable_list_items),
                ),
                seq(
                  kw("RADIO-BUTTONS"),
                  field("radio_buttons", $.__variable_radio_buttons),
                ),
                seq(
                  kw("SIZE"),
                  field("width", $._expression),
                  kw("BY"),
                  field("height", $._expression),
                ),
                kw("SCROLLBAR-VERTICAL"),
                kw("NO-DRAG"),
              ),
            ),
          ),

          seq(optional(kw("NOT")), kw("CASE-SENSITIVE")),
          alias(kw("NO-UNDO"), $.no_undo),
          $.trigger_phrase,
        ),
      ),
    ),

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

  __variable_extent_phrase: ($) =>
    seq(kw("EXTENT"), optional($.__variable_extent_size)),

  __variable_format_phrase: ($) =>
    seq(kw("FORMAT"), field("format", $.string_literal)),

  __variable_initial_option: ($) =>
    seq(
      kw("INITIAL", { offset: 4 }),
      choice($._expression, seq("[", optional($._expressions), "]")),
    ),
});
