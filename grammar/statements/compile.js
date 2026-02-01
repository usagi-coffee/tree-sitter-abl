module.exports = ({ kw }) => ({
  compile_statement: ($) => seq(kw("COMPILE"), $.__compile_body, $._terminator),
  __compile_body: ($) =>
    seq(
      field("file", $.__compile_file),
      repeat(alias($.__compile_option, $.compile_option)),
      optional(kw("NO-ERROR")),
    ),
  __compile_file: ($) =>
    choice(
      $.identifier,
      $.qualified_name,
      $.string_literal,
      seq(kw("VALUE"), "(", $._expression, ")"),
    ),
  __compile_option: ($) =>
    choice(
      seq(
        kw("SAVE"),
        optional(seq("=", field("save", $._expression))),
        optional(seq(kw("INTO"), field("into", $._expression))),
      ),
      $.__compile_listing_option,
      seq(kw("XCODE"), field("xcode", $._expression)),
      $.__compile_xref_option,
      seq(kw("XREF-XML"), field("xref_xml", $._expression)),
      $.__compile_string_xref_option,
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
      kw("ATTR-SPACE"),
      kw("NO-ATTR-SPACE"),
      seq(
        kw("STREAM-IO"),
        optional(seq("=", field("stream_io", $._expression))),
      ),
      seq(kw("V6FRAME"), optional(seq("=", field("v6frame", $._expression)))),
      kw("USE-REVVIDEO"),
      kw("USE-UNDERLINE"),
      kw("GENERATE-MD5"),
    ),

  __compile_listing_option: ($) =>
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
  __compile_xref_option: ($) =>
    seq(
      kw("XREF"),
      field("xref", $._expression),
      optional(
        seq(kw("APPEND"), optional(seq("=", field("append", $._expression)))),
      ),
    ),
  __compile_string_xref_option: ($) =>
    seq(
      kw("STRING-XREF"),
      field("string_xref", $._expression),
      optional(
        seq(kw("APPEND"), optional(seq("=", field("append", $._expression)))),
      ),
    ),
});
