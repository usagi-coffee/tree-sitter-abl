export default ({ kw }) => ({
  __system_dialog_prefix: ($) => kw("SYSTEM-DIALOG"),

  system_dialog_color_statement: ($) =>
    seq($.__system_dialog_prefix, $.__system_dialog_color_body, $._terminator),

  __system_dialog_color_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_color,
      field("color", $._expression),
      optional(alias($.__system_dialog_update_phrase, $.update_phrase)),
      optional($.in_window_phrase),
    ),

  system_dialog_font_statement: ($) =>
    seq($.__system_dialog_prefix, $.__system_dialog_font_body, $._terminator),

  __system_dialog_font_body: ($) =>
    seq(
      $._kw_font,
      field("font", $._expression),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat(
        choice(
          alias(kw("ANSI-ONLY"), $.ansi_only),
          alias(kw("FIXED-ONLY"), $.fixed_only),
          seq(kw("MAX-SIZE"), field("max_size", $._expression)),
          seq($._kw_min_size, field("min_size", $._expression)),
          $.__system_dialog_window_option,
        ),
      ),
    ),

  system_dialog_get_dir_statement: ($) =>
    seq($.__system_dialog_prefix, $.__system_dialog_get_dir_body, $._terminator),

  __system_dialog_get_dir_body: ($) =>
    seq(
      kw("GET-DIR"),
      field("variable", $.identifier),
      optional($.__system_dialog_get_dir_options),
    ),

  __system_dialog_get_dir_options: ($) =>
    prec.right(
      seq(
        choice(
          $.__system_dialog_initial_dir_option,
          $.__system_dialog_title_option,
          $.__system_dialog_window_option,
        ),
        optional($.__system_dialog_get_dir_options),
      ),
    ),

  system_dialog_get_file_statement: ($) =>
    seq($.__system_dialog_prefix, $.__system_dialog_get_file_body, $._terminator),

  __system_dialog_get_file_body: ($) =>
    seq(
      kw("GET-FILE"),
      field("variable", $.identifier),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat(
        choice(
          alias($.__system_dialog_filters, $.filters_phrase),
          alias(kw("ASK-OVERWRITE"), $.ask_overwrite),
          alias(kw("CREATE-TEST-FILE"), $.create_test_file),
          seq(kw("DEFAULT-EXTENSION"), field("extension", $._expression)),
          $.__system_dialog_initial_dir_option,
          alias(kw("MUST-EXIST"), $.must_exist),
          alias(kw("RETURN-TO-START-DIR"), $.return_to_start_dir),
          alias(kw("SAVE-AS"), $.save_as),
          $.__system_dialog_title_option,
          alias(kw("USE-FILENAME"), $.use_filename),
          $.__system_dialog_window_option,
        ),
      ),
    ),

  system_dialog_printer_setup_statement: ($) =>
    seq($.__system_dialog_prefix, $.__system_dialog_printer_setup_body, $._terminator),

  __system_dialog_printer_setup_body: ($) =>
    seq(kw("PRINTER-SETUP"), optional($.__system_dialog_printer_setup_options)),

  // oxlint-disable-next-line tree-sitter-optimize/recursive-choice-item-extraction
  __system_dialog_printer_setup_options: ($) =>
    prec.right(
      seq(
        choice(
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          seq(kw("NUM-COPIES"), field("copies", $._expression)),
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          alias(kw("LANDSCAPE"), $.landscape),
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          alias(kw("PORTRAIT"), $.portrait),
          $.__system_dialog_window_option,
        ),
        optional($.__system_dialog_printer_setup_options),
      ),
    ),

  __system_dialog_filters: ($) =>
    seq(
      kw("FILTERS"),
      $.__system_dialog_filters_pairs,
      optional(alias($.__system_dialog_initial_filter_phrase, $.initial_filter_phrase)),
    ),
  __system_dialog_window_option: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
    choice(alias($.__system_dialog_update_phrase, $.update_phrase), $.in_window_phrase),
  __system_dialog_initial_dir_option: ($) =>
    seq(kw("INITIAL-DIR"), field("initial_dir", $._expression)),
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
  __system_dialog_title_option: ($) => seq($._kw_title, field("title", $._expression)),
  __system_dialog_update_phrase: ($) => seq($._kw_update, field("update", $.identifier)),
  __system_dialog_initial_filter_phrase: ($) =>
    seq(kw("INITIAL-FILTER"), field("initial", $._expression)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __system_dialog_filters_pairs: ($) =>
    seq(
      $.__system_dialog_filter_pair,
      optional(seq(optional(","), $.__system_dialog_filters_pairs)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __system_dialog_filter_pair: ($) =>
    seq(field("name", $._expression), field("spec", $._expression)),
});
