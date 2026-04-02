module.exports = ({ kw }) => ({
  compile_statement: ($) => seq(kw("COMPILE"), $.__compile_body, $._no_error_terminator),

  __compile_body: ($) => seq(field("file", $.__compile_file), repeat($.__compile_option)),

  __compile_file: ($) =>
    choice($.identifier, $.qualified_name, $.string_literal, $._value_expression),

  __compile_option: ($) =>
    choice(
      seq(
        kw("SAVE"),
        optional(seq("=", field("save", $._expression))),
        optional(seq(kw("INTO"), field("into", $._expression))),
      ),
      $.__compile_listing_option,
      seq(kw("XCODE"), field("xcode", $._expression)),
      seq(kw("XREF"), field("xref", $._expression), optional($.__compile_append_option)),
      seq(kw("XREF-XML"), field("xref_xml", $._expression)),
      seq(
        kw("STRING-XREF"),
        field("string_xref", $._expression),
        optional($.__compile_append_option),
      ),
      seq(kw("DEBUG-LIST"), field("debug_list", $._expression)),
      seq(kw("PREPROCESS"), field("preprocess", $._expression)),
      seq(kw("OPTIONS"), field("options", $._expression)),
      seq(kw("OPTIONS-FILE"), field("options_file", $._expression)),
      seq(kw("MIN-SIZE"), optional(alias($.__compile_equals_expression, $.min_size))),
      seq(
        kw("DEFAULT-UNTRANSLATABLE"),
        optional(alias($.__compile_equals_expression, $.default_untranslatable)),
      ),
      seq(kw("LANGUAGES"), "(", field("languages", $._expression), ")"),
      seq(kw("TEXT-SEG-GROW"), field("text_seg_grow", $._expression)),
      alias(kw("ATTR-SPACE"), $.attr_space),
      alias(kw("NO-ATTR-SPACE"), $.no_attr_space),
      seq(kw("STREAM-IO"), optional(alias($.__compile_equals_expression, $.stream_io))),
      seq(kw("V6FRAME"), optional(alias($.__compile_equals_expression, $.v6frame))),
      alias(kw("USE-REVVIDEO"), $.use_revvideo),
      alias(kw("USE-UNDERLINE"), $.use_underline),
      alias(kw("GENERATE-MD5"), $.generate_md5),
    ),
  __compile_listing_option: ($) =>
    seq(kw("LISTING"), field("listing", $._expression), optional($.__compile_listing_tail)),
  __compile_listing_tail: ($) =>
    choice(
      $.__compile_append_option,
      seq(
        kw("PAGE-SIZE"),
        field("page_size", $._expression),
        optional(seq(kw("PAGE-WIDTH"), field("page_width", $._expression))),
      ),
      seq(
        kw("PAGE-WIDTH"),
        field("page_width", $._expression),
        optional(seq(kw("PAGE-SIZE"), field("page_size", $._expression))),
      ),
    ),
  __compile_append_option: ($) =>
    seq(kw("APPEND"), optional(seq("=", field("append", $._expression)))),
  __compile_equals_expression: ($) => seq("=", field("value", $._expression)),
});
