export default ({ kw }) => ({
  system_help_statement: ($) => seq($.__system_help_prefix, $._no_error_terminator),

  __system_help_prefix: ($) =>
    seq(
      kw("SYSTEM-HELP"),
      field("topic", $.__system_help_expression),
      optional(seq(kw("WINDOW-NAME"), field("window_name", $.__system_help_expression))),
      optional($.__system_help_action),
    ),

  __system_help_action: ($) =>
    choice(
      alias(kw("CONTENTS"), $.contents),
      alias(kw("QUIT"), $.quit),
      alias(kw("FINDER"), $.finder),
      alias(kw("FORCE-FILE"), $.force_file),
      alias(kw("HELP"), $.help),
      seq(kw("CONTEXT"), field("context", $.__system_help_expression)),
      seq(kw("CONTEXT-POPUP"), field("context_popup", $.__system_help_expression)),
      seq(kw("HELP-TOPIC"), field("help_topic", $.__system_help_expression)),
      seq(kw("KEY"), field("key", $.__system_help_expression)),
      seq(kw("ALTERNATE-KEY"), field("alternate_key", $.__system_help_expression)),
      seq(kw("PARTIAL-KEY"), field("partial_key", $.__system_help_expression)),
      seq(kw("SET-CONTENTS"), field("set_contents", $.__system_help_expression)),
      seq(kw("COMMAND"), field("command", $.__system_help_expression)),
      seq(
        kw("MULTIPLE-KEY"),
        field("multiple_key", $.__system_help_expression),
        kw("TEXT"),
        field("text", $.__system_help_expression),
      ),
      $.__system_help_position,
    ),

  __system_help_position: ($) =>
    seq(
      kw("POSITION"),
      choice(
        alias(kw("MAXIMIZE"), $.maximize),
        seq(
          kw("X"),
          field("x", $.__system_help_expression),
          kw("Y"),
          field("y", $.__system_help_expression),
          kw("WIDTH"),
          field("width", $.__system_help_expression),
          kw("HEIGHT"),
          field("height", $.__system_help_expression),
        ),
      ),
    ),

  __system_help_expression: ($) => $._expression,
});
