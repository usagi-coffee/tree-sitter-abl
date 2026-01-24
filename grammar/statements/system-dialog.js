module.exports = ({ kw, tkw }) => ({
  system_dialog_color_statement: ($) =>
    seq(
      tkw("SYSTEM-DIALOG"),
      kw("COLOR"),
      field("color", $._expression),
      optional(seq(kw("UPDATE"), field("update", $.identifier))),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),

  system_dialog_font_statement: ($) =>
    seq(
      tkw("SYSTEM-DIALOG"),
      kw("FONT"),
      field("font", $._expression),
      optional(tkw("ANSI-ONLY")),
      optional(tkw("FIXED-ONLY")),
      optional(seq(kw("MAX-SIZE"), field("max_size", $._expression))),
      optional(seq(kw("MIN-SIZE"), field("min_size", $._expression))),
      optional(seq(kw("UPDATE"), field("update", $.identifier))),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),

  system_dialog_get_dir_statement: ($) =>
    seq(
      tkw("SYSTEM-DIALOG"),
      kw("GET-DIR"),
      field("variable", $.identifier),
      optional(seq(kw("INITIAL-DIR"), field("initial_dir", $._expression))),
      optional(seq(kw("TITLE"), field("title", $._expression))),
      optional(seq(kw("UPDATE"), field("update", $.identifier))),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),

  system_dialog_get_file_statement: ($) =>
    seq(
      tkw("SYSTEM-DIALOG"),
      kw("GET-FILE"),
      field("variable", $.identifier),
      optional(alias($.__system_dialog_filters, $.filters_phrase)),
      optional(tkw("ASK-OVERWRITE")),
      optional(tkw("CREATE-TEST-FILE")),
      optional(seq(kw("DEFAULT-EXTENSION"), field("extension", $._expression))),
      optional(seq(kw("INITIAL-DIR"), field("initial_dir", $._expression))),
      optional(tkw("MUST-EXIST")),
      optional(tkw("RETURN-TO-START-DIR")),
      optional(tkw("SAVE-AS")),
      optional(seq(kw("TITLE"), field("title", $._expression))),
      optional(tkw("USE-FILENAME")),
      optional(seq(kw("UPDATE"), field("update", $.identifier))),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),

  __system_dialog_filters: ($) =>
    seq(
      kw("FILTERS"),
      repeat1(seq(field("name", $._expression), field("spec", $._expression))),
      optional(seq(kw("INITIAL-FILTER"), field("initial", $._expression))),
    ),

  system_dialog_printer_setup_statement: ($) =>
    seq(
      tkw("SYSTEM-DIALOG"),
      kw("PRINTER-SETUP"),
      optional(seq(kw("NUM-COPIES"), field("copies", $._expression))),
      optional(choice(kw("LANDSCAPE"), kw("PORTRAIT"))),
      optional(seq(kw("UPDATE"), field("update", $.identifier))),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),
});
