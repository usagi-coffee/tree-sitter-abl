module.exports = ({ kw, tkw }) => ({
  system_dialog_color_statement: ($) =>
    seq(
      tkw("SYSTEM-DIALOG"),
      kw("COLOR"),
      $.__system_dialog_color_body,
      $._terminator,
    ),

  __system_dialog_color_body: ($) =>
    seq(
      field("color", $._expression),
      optional(seq(kw("UPDATE"), field("update", $.identifier))),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
    ),

  system_dialog_font_statement: ($) =>
    seq(
      tkw("SYSTEM-DIALOG"),
      kw("FONT"),
      $.__system_dialog_font_body,
      $._terminator,
    ),

  __system_dialog_font_body: ($) =>
    seq(
      field("font", $._expression),
      repeat(
        choice(
          tkw("ANSI-ONLY"),
          tkw("FIXED-ONLY"),
          seq(kw("MAX-SIZE"), field("max_size", $._expression)),
          seq(kw("MIN-SIZE"), field("min_size", $._expression)),
          seq(kw("UPDATE"), field("update", $.identifier)),
          seq(kw("IN"), kw("WINDOW"), field("window", $._expression)),
        ),
      ),
    ),

  system_dialog_get_dir_statement: ($) =>
    seq(
      tkw("SYSTEM-DIALOG"),
      kw("GET-DIR"),
      $.__system_dialog_get_dir_body,
      $._terminator,
    ),

  __system_dialog_get_dir_body: ($) =>
    seq(
      field("variable", $.identifier),
      repeat(
        choice(
          seq(kw("INITIAL-DIR"), field("initial_dir", $._expression)),
          seq(kw("TITLE"), field("title", $._expression)),
          seq(kw("UPDATE"), field("update", $.identifier)),
          seq(kw("IN"), kw("WINDOW"), field("window", $._expression)),
        ),
      ),
    ),

  system_dialog_get_file_statement: ($) =>
    seq(
      tkw("SYSTEM-DIALOG"),
      kw("GET-FILE"),
      $.__system_dialog_get_file_body,
      $._terminator,
    ),

  __system_dialog_get_file_body: ($) =>
    seq(
      field("variable", $.identifier),
      repeat(
        choice(
          alias($.__system_dialog_filters, $.filters_phrase),
          tkw("ASK-OVERWRITE"),
          tkw("CREATE-TEST-FILE"),
          seq(kw("DEFAULT-EXTENSION"), field("extension", $._expression)),
          seq(kw("INITIAL-DIR"), field("initial_dir", $._expression)),
          tkw("MUST-EXIST"),
          tkw("RETURN-TO-START-DIR"),
          tkw("SAVE-AS"),
          seq(kw("TITLE"), field("title", $._expression)),
          tkw("USE-FILENAME"),
          seq(kw("UPDATE"), field("update", $.identifier)),
          seq(kw("IN"), kw("WINDOW"), field("window", $._expression)),
        ),
      ),
    ),

  system_dialog_printer_setup_statement: ($) =>
    seq(
      tkw("SYSTEM-DIALOG"),
      kw("PRINTER-SETUP"),
      repeat(
        choice(
          seq(kw("NUM-COPIES"), field("copies", $._expression)),
          kw("LANDSCAPE"),
          kw("PORTRAIT"),
          seq(kw("UPDATE"), field("update", $.identifier)),
          seq(kw("IN"), kw("WINDOW"), field("window", $._expression)),
        ),
      ),
      $._terminator,
    ),

  __system_dialog_filters: ($) =>
    seq(
      kw("FILTERS"),
      repeat1(seq(field("name", $._expression), field("spec", $._expression))),
      optional(seq(kw("INITIAL-FILTER"), field("initial", $._expression))),
    ),
});
