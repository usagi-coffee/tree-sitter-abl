module.exports = ({ kw }) => ({
  compile_statement: ($) => seq(kw("COMPILE"), $.__compile_body, $._terminator),

  __compile_body: ($) =>
    seq(
      field("file", $.__compile_file),
      repeat($.__compile_option),
      optional(kw("NO-ERROR")),
    ),

  __compile_file: ($) =>
    choice(
      $.identifier,
      $.qualified_name,
      $.string_literal,
      seq(kw("VALUE"), "(", field("value", $._expression), ")"),
    ),

  __compile_option: ($) =>
    choice(
      seq(
        kw("SAVE"),
        optional(seq("=", field("save", $._expression))),
        optional(seq(kw("INTO"), field("into", $._expression))),
      ),
      choice(
        seq(
          kw("LISTING"),
          field("listing", $._expression),
          kw("APPEND"),
          optional(seq("=", field("append", $._expression))),
        ),
        seq(
          kw("LISTING"),
          field("listing", $._expression),
          kw("PAGE-SIZE"),
          field("page_size", $._expression),
          optional(seq(kw("PAGE-WIDTH"), field("page_width", $._expression))),
        ),
        seq(
          kw("LISTING"),
          field("listing", $._expression),
          kw("PAGE-WIDTH"),
          field("page_width", $._expression),
          optional(seq(kw("PAGE-SIZE"), field("page_size", $._expression))),
        ),
        seq(kw("LISTING"), field("listing", $._expression)),
      ),
      seq(kw("XCODE"), field("xcode", $._expression)),
      seq(
        kw("XREF"),
        field("xref", $._expression),
        optional(
          seq(kw("APPEND"), optional(seq("=", field("append", $._expression)))),
        ),
      ),
      seq(kw("XREF-XML"), field("xref_xml", $._expression)),
      seq(
        kw("STRING-XREF"),
        field("string_xref", $._expression),
        optional(
          seq(kw("APPEND"), optional(seq("=", field("append", $._expression)))),
        ),
      ),
      seq(kw("DEBUG-LIST"), field("debug_list", $._expression)),
      seq(kw("PREPROCESS"), field("preprocess", $._expression)),
      seq(kw("OPTIONS"), field("options", $._expression)),
      seq(kw("OPTIONS-FILE"), field("options_file", $._expression)),
      seq(kw("MIN-SIZE"), optional(seq("=", field("min_size", $._expression)))),
      seq(
        kw("DEFAULT-UNTRANSLATABLE"),
        optional(seq("=", field("default_untranslatable", $._expression))),
      ),
      seq(kw("LANGUAGES"), "(", field("languages", $._expression), ")"),
      seq(kw("TEXT-SEG-GROW"), field("text_seg_grow", $._expression)),
      alias(kw("ATTR-SPACE"), $.attr_space),
      alias(kw("NO-ATTR-SPACE"), $.no_attr_space),
      seq(
        kw("STREAM-IO"),
        optional(seq("=", field("stream_io", $._expression))),
      ),
      seq(kw("V6FRAME"), optional(seq("=", field("v6frame", $._expression)))),
      alias(kw("USE-REVVIDEO"), $.use_revvideo),
      alias(kw("USE-UNDERLINE"), $.use_underline),
      alias(kw("GENERATE-MD5"), $.generate_md5),
    ),
});
