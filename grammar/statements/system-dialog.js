module.exports = ({ kw }) => ({
  system_dialog_color_statement: ($) =>
    seq(kw("SYSTEM-DIALOG"), $.__system_dialog_color_body, $._terminator),

  __system_dialog_color_body: ($) =>
    seq(
      kw("COLOR"),
      field("color", $._expression),
      optional(seq(kw("UPDATE"), field("update", $.identifier))),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._window_handle))),
    ),

  system_dialog_font_statement: ($) =>
    seq(kw("SYSTEM-DIALOG"), $.__system_dialog_font_body, $._terminator),

  __system_dialog_font_body: ($) =>
    seq(
      kw("FONT"),
      field("font", $._expression),
      repeat(
        choice(
          kw("ANSI-ONLY"),
          kw("FIXED-ONLY"),
          seq(kw("MAX-SIZE"), field("max_size", $._expression)),
          seq(kw("MIN-SIZE"), field("min_size", $._expression)),
          seq(kw("UPDATE"), field("update", $.identifier)),
          seq(kw("IN"), kw("WINDOW"), field("window", $._window_handle)),
        ),
      ),
    ),

  system_dialog_get_dir_statement: ($) =>
    seq(kw("SYSTEM-DIALOG"), $.__system_dialog_get_dir_body, $._terminator),

  __system_dialog_get_dir_body: ($) =>
    seq(
      kw("GET-DIR"),
      field("variable", $.identifier),
      repeat(
        choice(
          seq(kw("INITIAL-DIR"), field("initial_dir", $._expression)),
          seq(kw("TITLE"), field("title", $._expression)),
          seq(kw("UPDATE"), field("update", $.identifier)),
          seq(kw("IN"), kw("WINDOW"), field("window", $._window_handle)),
        ),
      ),
    ),

  system_dialog_get_file_statement: ($) =>
    seq(kw("SYSTEM-DIALOG"), $.__system_dialog_get_file_body, $._terminator),

  __system_dialog_get_file_body: ($) =>
    seq(
      kw("GET-FILE"),
      field("variable", $.identifier),
      repeat(
        choice(
          alias($.__system_dialog_filters, $.filters_phrase),
          kw("ASK-OVERWRITE"),
          kw("CREATE-TEST-FILE"),
          seq(kw("DEFAULT-EXTENSION"), field("extension", $._expression)),
          seq(kw("INITIAL-DIR"), field("initial_dir", $._expression)),
          kw("MUST-EXIST"),
          kw("RETURN-TO-START-DIR"),
          kw("SAVE-AS"),
          seq(kw("TITLE"), field("title", $._expression)),
          kw("USE-FILENAME"),
          seq(kw("UPDATE"), field("update", $.identifier)),
          seq(kw("IN"), kw("WINDOW"), field("window", $._window_handle)),
        ),
      ),
    ),

  system_dialog_printer_setup_statement: ($) =>
    seq(
      kw("SYSTEM-DIALOG"),
      $.__system_dialog_printer_setup_body,
      $._terminator,
    ),

  __system_dialog_printer_setup_body: ($) =>
    seq(
      kw("PRINTER-SETUP"),
      repeat(
        choice(
          seq(kw("NUM-COPIES"), field("copies", $._expression)),
          kw("LANDSCAPE"),
          kw("PORTRAIT"),
          seq(kw("UPDATE"), field("update", $.identifier)),
          seq(kw("IN"), kw("WINDOW"), field("window", $._window_handle)),
        ),
      ),
    ),

  __system_dialog_filters: ($) =>
    seq(
      kw("FILTERS"),
      $.__system_dialog_filters_pairs,
      optional(seq(kw("INITIAL-FILTER"), field("initial", $._expression))),
    ),
  __system_dialog_filters_pairs: ($) =>
    repeat1($.__system_dialog_filter_pair),
  __system_dialog_filter_pair: ($) =>
    seq(field("name", $._expression), field("spec", $._expression)),
});
