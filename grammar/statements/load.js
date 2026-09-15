export default ({ kw }) => ({
  load_statement: ($) => seq($.__load_prefix, $._no_error_terminator),

  __load_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("LOAD"),
      field("file", $._expression),
      optional(seq(kw("DIR"), field("dir", $._expression))),
      optional($.__load_after_dir),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __load_after_dir: ($) =>
    choice(
      seq(kw("APPLICATION"), field("app", $._expression), optional($.__load_after_application)),
      $.__load_after_application,
    ),
  __load_after_application: ($) =>
    choice(
      seq(alias($._new_keyword, $.new), optional($.__load_base_key_option)),
      $.__load_base_key_option,
    ),
  __load_base_key_option: ($) => seq(kw("BASE-KEY"), field("base_key", $._expression)),
});
