export default ({ kw }) => ({
  wait_for_statement: ($) => seq($.__wait_for_prefix, $._terminator),

  __wait_for_prefix: ($) =>
    seq(
      kw("WAIT-FOR"),
      choice(
        // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
        seq(
          alias($.__wait_for_of_phrase, $.of_phrase),
          optional($.__wait_for_of_tail),
          optional($.__wait_for_focus_pause_tail),
        ),
        seq(
          field("method", $.function_call),
          optional(seq($._kw_set, field("return_value", $._identifier_or_access))),
        ),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __wait_for_focus_pause_tail: ($) =>
    choice(
      seq(
        alias($.__wait_for_focus_phrase, $.focus_phrase),
        optional(alias($.__wait_for_pause_phrase, $.pause_phrase)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
      alias($.__wait_for_pause_phrase, $.pause_phrase),
    ),
  __wait_for_of_phrase: ($) =>
    seq(
      field("events", $.__wait_for_event_list),
      $._of_keyword,
      field("widgets", prec.right($.__wait_for_widgets)),
    ),
  __wait_for_of_tail: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
    seq($._kw_or, alias($.__wait_for_of_phrase, $.of_phrase), optional($.__wait_for_of_tail)),
  __wait_for_focus_phrase: ($) => seq(kw("FOCUS"), field("focus", $.widget_phrase)),
  __wait_for_pause_phrase: ($) => seq(kw("PAUSE"), field("duration", $._expression)),

  __wait_for_widgets: ($) => seq($.widget_phrase, optional(seq(",", $.__wait_for_widgets))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-field-sequence
  __wait_for_event_list: ($) => seq($._events, optional($.__wait_for_event_list_tail)),
  // oxlint-disable-next-line tree-sitter-optimize/recursive-tail-reuse
  __wait_for_event_list_tail: ($) =>
    seq(optional(","), $._events, optional($.__wait_for_event_list_tail)),
});
