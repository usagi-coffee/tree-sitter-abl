module.exports = ({ kw }) => ({
  system_dialog_color_statement: ($) =>
    seq(kw("SYSTEM-DIALOG"), $.__system_dialog_color_body, $._terminator),

  __system_dialog_color_body: ($) =>
    seq(
      kw("COLOR"),
      field("color", $._expression),
      optional(alias($.__system_dialog_update_phrase, $.update_phrase)),
      optional($.in_window_phrase),
    ),

  system_dialog_font_statement: ($) =>
    seq(kw("SYSTEM-DIALOG"), $.__system_dialog_font_body, $._terminator),

  __system_dialog_font_body: ($) =>
    seq(
      kw("FONT"),
      field("font", $._expression),
      repeat(
        choice(
          alias(kw("ANSI-ONLY"), $.ansi_only),
          alias(kw("FIXED-ONLY"), $.fixed_only),
          seq(kw("MAX-SIZE"), field("max_size", $._expression)),
          seq(kw("MIN-SIZE"), field("min_size", $._expression)),
          alias($.__system_dialog_update_phrase, $.update_phrase),
          $.in_window_phrase,
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
          alias($.__system_dialog_update_phrase, $.update_phrase),
          $.in_window_phrase,
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
          alias(kw("ASK-OVERWRITE"), $.ask_overwrite),
          alias(kw("CREATE-TEST-FILE"), $.create_test_file),
          seq(kw("DEFAULT-EXTENSION"), field("extension", $._expression)),
          seq(kw("INITIAL-DIR"), field("initial_dir", $._expression)),
          alias(kw("MUST-EXIST"), $.must_exist),
          alias(kw("RETURN-TO-START-DIR"), $.return_to_start_dir),
          alias(kw("SAVE-AS"), $.save_as),
          seq(kw("TITLE"), field("title", $._expression)),
          alias(kw("USE-FILENAME"), $.use_filename),
          alias($.__system_dialog_update_phrase, $.update_phrase),
          $.in_window_phrase,
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
          alias(kw("LANDSCAPE"), $.landscape),
          alias(kw("PORTRAIT"), $.portrait),
          alias($.__system_dialog_update_phrase, $.update_phrase),
          $.in_window_phrase,
        ),
      ),
    ),

  __system_dialog_filters: ($) =>
    seq(
      kw("FILTERS"),
      $.__system_dialog_filters_pairs,
      optional(alias($.__system_dialog_initial_filter_phrase, $.initial_filter_phrase)),
    ),
  __system_dialog_update_phrase: ($) =>
    seq(kw("UPDATE"), field("update", $.identifier)),
  __system_dialog_initial_filter_phrase: ($) =>
    seq(kw("INITIAL-FILTER"), field("initial", $._expression)),
  __system_dialog_filters_pairs: ($) =>
    repeat1($.__system_dialog_filter_pair),
  __system_dialog_filter_pair: ($) =>
    seq(field("name", $._expression), field("spec", $._expression)),
});
