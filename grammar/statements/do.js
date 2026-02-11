module.exports = ({ kw }) => ({
  do_statement: ($) =>
    seq(optional($._label), $.__do_body, kw("END"), $._terminator),

  __do_body: ($) =>
    seq(
      kw("DO"),
      optional(
        alias(
          seq(
            kw("FOR"),
            seq(
              field("record", $._identifier_or_qualified_name),
              repeat(
                seq(",", field("record", $._identifier_or_qualified_name)),
              ),
            ),
          ),
          $.for_phrase,
        ),
      ),
      optional($.preselect_phrase),
      optional($.query_tuning_phrase),
      optional(alias(kw("TRANSACTION"), $.transaction)),
      optional(choice($.__do_while_phrase, $.__do_loop_phrase)),
      optional(alias(kw("TRANSACTION"), $.transaction)),
      repeat(
        choice(
          $.stop_after_phrase,
          $.on_endkey_phrase,
          $.on_stop_phrase,
          $.on_error_phrase,
          $.on_quit_phrase,
          $.frame_phrase,
        ),
      ),
      $.body,
    ),

  body: ($) =>
    prec.right(
      seq(
        choice(alias($._colon, ":"), $._terminator_dot),
        repeat($._statement),
      ),
    ),

  __do_loop_phrase: ($) =>
    seq(
      field("variable", $.identifier),
      "=",
      field("start", $._expression),
      kw("TO"),
      field("end", $._expression),
      optional(seq(kw("BY"), field("step", $._expression))),
    ),
  __do_while_phrase: ($) => seq(kw("WHILE"), field("condition", $._expression)),
});
