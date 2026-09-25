const ON_WIDGET_EVENTS = [
  "AFTER-FILL",
  "AFTER-ROW-FILL",
  "ANY-KEY",
  "ANY-PRINTABLE",
  "BACK-TAB",
  "BACKSPACE",
  "BEFORE-FILL",
  "BEFORE-ROW-FILL",
  "BELL",
  "CHOOSE",
  "CLEAR",
  "CLOSE",
  "CONNECT",
  "CURSOR-DOWN",
  "CURSOR-LEFT",
  "CURSOR-RIGHT",
  "CURSOR-UP",
  "DEFAULT-ACTION",
  "DELETE-CHARACTER",
  "DOWN",
  "END-ERROR",
  "ENDKEY",
  "ENTRY",
  "ERROR",
  "FIND-FAILED",
  "GO",
  "HELP",
  "LEAVE",
  "LEFT",
  "LEFT-MOUSE-CLICK",
  "LEFT-MOUSE-DBLCLICK",
  "LEFT-MOUSE-DOWN",
  "LEFT-MOUSE-UP",
  "MIDDLE-MOUSE-CLICK",
  "MIDDLE-MOUSE-DBLCLICK",
  "MIDDLE-MOUSE-DOWN",
  "MIDDLE-MOUSE-UP",
  "MOUSE-EXTEND-CLICK",
  "MOUSE-EXTEND-DBLCLICK",
  "MOUSE-EXTEND-DOWN",
  "MOUSE-EXTEND-UP",
  "MOUSE-MENU-CLICK",
  "MOUSE-MENU-DBLCLICK",
  "MOUSE-MENU-DOWN",
  "MOUSE-MENU-UP",
  "MOUSE-MOVE-CLICK",
  "MOUSE-MOVE-DBLCLICK",
  "MOUSE-MOVE-DOWN",
  "MOUSE-MOVE-UP",
  "MOUSE-SELECT-CLICK",
  "MOUSE-SELECT-DBLCLICK",
  "MOUSE-SELECT-DOWN",
  "MOUSE-SELECT-UP",
  "NEXT-FRAME",
  "OFF-END",
  "PREV-FRAME",
  "PROCEDURE-COMPLETE",
  "READ-RESPONSE",
  "RECALL",
  "RETURN",
  "RIGHT",
  "RIGHT-MOUSE-CLICK",
  "RIGHT-MOUSE-DBLCLICK",
  "RIGHT-MOUSE-DOWN",
  "RIGHT-MOUSE-UP",
  "ROW-CREATE",
  "ROW-DELETE",
  "ROW-UPDATE",
  "SELECT",
  "SYNCHRONIZE",
  "TAB",
  "U1",
  "U2",
  "U3",
  "U4",
  "U5",
  "U6",
  "U7",
  "U8",
  "U9",
  "U10",
  "UP",
  "VALUE-CHANGED",
  "WINDOW-CLOSE",
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default ({ kw }) => ({
  on_statement: ($) =>
    prec.right(
      seq(
        $._on_keyword,
        choice(
          seq($.__on_ui_events, $.__on_ui_event_target, $.__on_trigger_action),
          choice(
            seq(
              field("event", $._delete_keyword),
              $._of_keyword,
              choice(
                $.__on_database_event_action,
                seq(
                  field("widget", alias($._frame_browse_menu_widget, $.widget_phrase)),
                  // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
                  optional(alias(kw("ANYWHERE"), $.anywhere)),
                  $.__on_trigger_action,
                ),
              ),
            ),
            seq(
              field("event", choice($._kw_create, $._kw_find, kw("WRITE"), $._kw_assign)),
              $._of_keyword,
              $.__on_database_event_action,
            ),
          ),
          seq(
            field("event", $.__on_key_label),
            field("function", alias($.__on_key_function, $.key_function)),
            $._terminator,
          ),
          $.__on_web_notify_branch,
        ),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __on_ui_event_target: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("ANYWHERE"), $.anywhere),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        alias($.__on_of_phrase, $.of_phrase),
        optional($.__on_ui_event_widgets_tail),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        optional(alias(kw("ANYWHERE"), $.anywhere)),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
  __on_ui_anywhere_branch: ($) => seq($.__on_ui_events, alias(kw("ANYWHERE"), $.anywhere)),
  __on_database_event_action: ($) =>
    seq(
      field("object", $._identifier_or_qualified_name),
      optional($.__on_database_event_tail),
      choice($.__on_revert_action, $._statement),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __on_database_event_tail: ($) =>
    choice(
      seq(
        alias($.__on_referencing_phrase, $.referencing_phrase),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        optional(alias(kw("OVERRIDE"), $.override)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("OVERRIDE"), $.override),
    ),
  __on_web_notify_branch: ($) =>
    seq(
      field("event", alias($.__on_web_notify_event, $.string_literal)),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("ANYWHERE"), $.anywhere),
      $._statement,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __on_trigger_action: ($) =>
    choice(
      $.__on_revert_action,
      seq(field("function", alias($.__on_ui_key_function, $.key_function)), $._terminator),
      $._statement,
      // oxlint-disable-next-line tree-sitter-optimize/optional-body-extraction
      seq(
        kw("PERSISTENT"),
        $._kw_run,
        field("procedure", $.identifier),
        optional($.arguments),
        optional(alias($.__on_in_phrase, $.in_phrase)),
        optional($.arguments),
        $._terminator,
      ),
    ),
  __on_in_phrase: ($) => seq($._in_keyword, field("context", $.__on_context_value)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/single-use-field-choice
  __on_context_value: ($) =>
    choice($.system_handle_identifier, $.object_access, $._identifier_or_qualified_name),
  __on_revert_action: ($) => seq(alias(kw("REVERT"), $.revert), $._terminator),
  // __on_key_label accepts both $.__on_ui_event_name tokens (TAB, ENDKEY, etc.)
  // and plain $._events (F1, F10, etc.).
  __on_key_label: ($) => choice(alias($.__on_ui_event_name, $.identifier), $._events),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __on_key_function: ($) =>
    choice(
      kw("ABORT"),
      kw("BACKSPACE"),
      $._kw_back_tab,
      $._kw_bell,
      $._kw_clear,
      kw("CURSOR-DOWN"),
      kw("CURSOR-LEFT"),
      kw("CURSOR-RIGHT"),
      kw("CURSOR-UP"),
      kw("DELETE-CHARACTER"),
      $._end_keyword,
      $._kw_end_error,
      $._kw_endkey,
      kw("ENTER-MENUBAR"),
      $._kw_error,
      $._kw_go,
      $._help_keyword,
      kw("HOME"),
      kw("INSERT-MODE"),
      kw("LEFT-END"),
      $._kw_next_frame,
      $._kw_prev_frame,
      kw("RECALL"),
      $._kw_return,
      kw("RIGHT-END"),
      kw("SCROLL-MODE"),
      $._kw_stop,
      $._kw_tab,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/broad-dispatcher
  __on_ui_key_function: ($) =>
    choice(
      $._kw_back_tab,
      $._kw_end_error,
      $._kw_endkey,
      $._kw_go,
      $._help_keyword,
      $._kw_next_frame,
      $._kw_prev_frame,
      $._kw_tab,
    ),
  __on_web_notify_event: ($) => token(/["']WEB-NOTIFY["']/i),
  __on_ui_event_name: ($) =>
    token(
      prec(
        1,
        new RegExp(
          `(${ON_WIDGET_EVENTS.slice()
            .sort((a, b) => b.length - a.length)
            .map(escapeRegex)
            .join("|")})`,
          "i",
        ),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __on_ui_event: ($) => choice($.__on_key_label, alias(token(choice("+", "-")), $.identifier)),
  __on_ui_events: ($) => seq(field("event", $.__on_ui_event), optional(seq(",", $.__on_ui_events))),
  __on_ui_event_widgets_tail: ($) =>
    seq(
      $._kw_or,
      seq(
        $.__on_ui_events,
        // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
        alias($.__on_of_phrase, $.of_phrase),
      ),
      optional($.__on_ui_event_widgets_tail),
    ),
  __on_of_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/list-head-extraction
    seq($._of_keyword, field("widget", $.widget_phrase), optional($.__on_of_widget_tail)),
  // oxlint-disable-next-line tree-sitter-optimize/tail-extraction
  __on_of_widget_tail: ($) =>
    seq(",", field("widget", $.widget_phrase), optional($.__on_of_widget_tail)),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __on_referencing_phrase: ($) =>
    choice(
      seq(
        $._new_keyword,
        optional($._kw_buffer),
        field("new_record", $.identifier),
        $._kw_old,
        optional($._kw_buffer),
        field("old_record", $.identifier),
      ),
      seq($._kw_old, optional($._kw_value), field("old_field", $.identifier)),
    ),
});
