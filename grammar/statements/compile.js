module.exports = ({ kw, tkw }) => ({
  compile_statement: ($) =>
    seq(
      tkw("COMPILE"),
      choice(
        seq(tkw("VALUE"), "(", field("file", $._expression), ")"),
        field("file", $._expression),
      ),
      repeat(alias($.__compile_option, $.compile_option)),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
  __compile_option: ($) =>
    choice(
      seq(kw("SAVE"), optional(seq(kw("INTO"), field("into", $._expression)))),
      seq(kw("LISTING"), field("listing", $._expression)),
      seq(kw("XCODE"), field("xcode", $._expression)),
      seq(kw("XREF"), field("xref", $._expression)),
      seq(kw("XREF-XML"), field("xref_xml", $._expression)),
      seq(kw("STRING-XREF"), field("string_xref", $._expression)),
      seq(kw("DEBUG-LIST"), field("debug_list", $._expression)),
      seq(kw("PREPROCESS"), field("preprocess", $._expression)),
      seq(kw("OPTIONS"), field("options", $._expression)),
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
});
