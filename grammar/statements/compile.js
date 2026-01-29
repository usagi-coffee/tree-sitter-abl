module.exports = ({ kw, tkw }) => ({
  compile_statement: ($) =>
    seq(tkw("COMPILE"), $.__compile_body, $._terminator),
  __compile_body: ($) =>
    seq(
      field("file", $._expression),
      repeat(alias($.__compile_option, $.compile_option)),
      optional(tkw("NO-ERROR")),
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
      seq(kw("MIN-SIZE"), field("min_size", $._expression)),
      seq(kw("LANGUAGES"), "(", repeat1($._expression), ")"),
      seq(kw("TEXT-SEG-GROWTH"), field("text_seg_growth", $._expression)),
      tkw("ATTR-SPACE"),
      tkw("NO-ATTR-SPACE"),
      tkw("STREAM-IO"),
      tkw("V6FRAME"),
      tkw("USE-REVVIDEO"),
      tkw("USE-UNDERLINE"),
      tkw("GENERATE-MD5"),
    ),

  __compile_listing_option: ($) =>
    choice(
      seq(
        kw("LISTING"),
        field("listing", $._expression),
        tkw("APPEND"),
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
