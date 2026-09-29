export default ({ kw }) => ({
  system_help_statement: ($) => seq($.__system_help_prefix, $._no_error_terminator),

  __system_help_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("SYSTEM-HELP"),
      field("topic", $._expression),
      optional(seq(kw("WINDOW-NAME"), field("window_name", $._expression))),
      optional($.__system_help_action),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __system_help_action: ($) =>
    choice(
      alias(kw("CONTENTS"), $.contents),
      alias($._kw_quit, $.quit),
      alias(kw("FINDER"), $.finder),
      alias(kw("FORCE-FILE"), $.force_file),
      alias($._kw_help, $.help),
      seq(kw("CONTEXT"), field("context", $._expression)),
      seq(kw("CONTEXT-POPUP"), field("context_popup", $._expression)),
      seq(kw("HELP-TOPIC"), field("help_topic", $._expression)),
      seq($._kw_key, field("key", $._expression)),
      seq(kw("ALTERNATE-KEY"), field("alternate_key", $._expression)),
      seq(kw("PARTIAL-KEY"), field("partial_key", $._expression)),
      seq(kw("SET-CONTENTS"), field("set_contents", $._expression)),
      seq($._kw_command, field("command", $._expression)),
      seq(
        kw("MULTIPLE-KEY"),
        field("multiple_key", $._expression),
        $._kw_text,
        field("text", $._expression),
      ),
      $.__system_help_position,
    ),

  __system_help_position: ($) =>
    seq(
      kw("POSITION"),
      choice(
        alias(kw("MAXIMIZE"), $.maximize),
        seq(
          $._kw_x,
          field("x", $._expression),
          $._kw_y,
          field("y", $._expression),
          kw("WIDTH"),
          field("width", $._expression),
          kw("HEIGHT"),
          field("height", $._expression),
        ),
      ),
    ),
});
