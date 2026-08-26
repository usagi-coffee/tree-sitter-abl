export default ({ kw }) => ({
  compile_statement: ($) => seq($.__compile_prefix, $._no_error_terminator),

  __compile_prefix: ($) =>
    seq(kw("COMPILE"), field("file", $.__compile_file), optional($.__compile_options)),
  __compile_options: ($) => prec.right(seq($.__compile_option, optional($.__compile_options))),
  __compile_option: ($) =>
    choice(
      seq(
        kw("SAVE"),
        optional(seq("=", field("save", $._expression))),
        optional(seq(kw("INTO"), field("into", $._expression))),
      ),
      seq(
        kw("LISTING"),
        field("listing", $._expression),
        optional(
          choice(
            $.__compile_append_option,
            seq($.__compile_page_size_option, optional($.__compile_page_width_option)),
            seq($.__compile_page_width_option, optional($.__compile_page_size_option)),
          ),
        ),
      ),
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
      seq(kw("MIN-SIZE"), optional(alias($._equals_value, $.min_size))),
      seq(kw("DEFAULT-UNTRANSLATABLE"), optional(alias($._equals_value, $.default_untranslatable))),
      seq(kw("LANGUAGES"), "(", field("languages", $._expression), ")"),
      seq(kw("TEXT-SEG-GROW"), field("text_seg_grow", $._expression)),
      alias(kw("ATTR-SPACE"), $.attr_space),
      alias(kw("NO-ATTR-SPACE"), $.no_attr_space),
      seq(kw("STREAM-IO"), optional(alias($._equals_value, $.stream_io))),
      seq(kw("V6FRAME"), optional(alias($._equals_value, $.v6frame))),
      alias(kw("USE-REVVIDEO"), $.use_revvideo),
      alias(kw("USE-UNDERLINE"), $.use_underline),
      alias(kw("GENERATE-MD5"), $.generate_md5),
    ),

  __compile_file: ($) =>
    choice($.identifier, $.qualified_name, $.string_literal, $._value_expression),

  __compile_append_option: ($) =>
    seq(kw("APPEND"), optional(seq("=", field("append", $._expression)))),
  __compile_page_size_option: ($) => seq(kw("PAGE-SIZE"), field("page_size", $._expression)),
  __compile_page_width_option: ($) => seq(kw("PAGE-WIDTH"), field("page_width", $._expression)),
});
