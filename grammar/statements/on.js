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

module.exports = ({ kw }) => ({
  on_statement: ($) =>
    prec.right(
      seq(
        kw("ON"),
        choice(
          $.__on_ui_event_branch,
          $.__on_database_event_branch,
          $.__on_key_label_branch,
          $.__on_web_notify_branch,
        ),
      ),
    ),
  __on_ui_event_branch: ($) =>
    choice($.__on_ui_anywhere_branch, $.__on_ui_of_branch),
  __on_ui_anywhere_branch: ($) =>
    seq(
      $.__on_ui_events,
      alias(kw("ANYWHERE"), $.anywhere),
      $.__on_trigger_action,
    ),
  __on_ui_of_branch: ($) =>
    seq(
      $.__on_ui_event_widgets,
      repeat(seq(kw("OR"), $.__on_ui_event_widgets)),
      optional(alias(kw("ANYWHERE"), $.anywhere)),
      $.__on_trigger_action,
    ),
  __on_database_event_branch: ($) =>
    seq(
      field("event", $.__on_database_event_name),
      kw("OF"),
      field("object", $._identifier_or_qualified_name),
      optional(alias($.__on_referencing_phrase, $.referencing_phrase)),
      optional(alias(kw("OVERRIDE"), $.override)),
      choice(seq(alias(kw("REVERT"), $.revert), $._terminator), $._statement),
    ),
  __on_key_label_branch: ($) =>
    seq(
      field("event", $.__on_key_label),
      field("function", alias($.__on_key_function, $.key_function)),
      $._terminator,
    ),
  __on_web_notify_branch: ($) =>
    seq(
      field("event", $.__on_web_notify_event),
      alias(kw("ANYWHERE"), $.anywhere),
      $._statement,
    ),
  __on_trigger_action: ($) =>
    choice(
      seq(alias(kw("REVERT"), $.revert), $._terminator),
      seq(
        field("function", alias($.__on_ui_key_function, $.key_function)),
        $._terminator,
      ),
      $._statement,
      seq(
        kw("PERSISTENT"),
        kw("RUN"),
        field("procedure", $.identifier),
        optional($.arguments),
        $._terminator,
      ),
    ),

  __on_database_event: ($) =>
    choice(kw("CREATE"), kw("DELETE"), kw("FIND"), kw("WRITE"), kw("ASSIGN")),
  __on_database_event_name: ($) => $.__on_database_event,
  __on_key_label: ($) => $._events,
  __on_key_function: ($) =>
    choice(
      kw("ABORT"),
      kw("BACKSPACE"),
      kw("BACK-TAB"),
      kw("BELL"),
      kw("CLEAR"),
      kw("CURSOR-DOWN"),
      kw("CURSOR-LEFT"),
      kw("CURSOR-RIGHT"),
      kw("CURSOR-UP"),
      kw("DELETE-CHARACTER"),
      kw("END"),
      kw("END-ERROR"),
      kw("ENDKEY"),
      kw("ENTER-MENUBAR"),
      kw("ERROR"),
      kw("GO"),
      kw("HELP"),
      kw("HOME"),
      kw("INSERT-MODE"),
      kw("LEFT-END"),
      kw("NEXT-FRAME"),
      kw("PREV-FRAME"),
      kw("RECALL"),
      kw("RETURN"),
      kw("RIGHT-END"),
      kw("SCROLL-MODE"),
      kw("STOP"),
      kw("TAB"),
    ),
  __on_ui_key_function: ($) =>
    choice(
      kw("BACK-TAB"),
      kw("END-ERROR"),
      kw("ENDKEY"),
      kw("GO"),
      kw("HELP"),
      kw("NEXT-FRAME"),
      kw("PREV-FRAME"),
      kw("TAB"),
    ),
  __on_web_notify_event: ($) =>
    prec(1, alias(token(/["']WEB-NOTIFY["']/i), $.string_literal)),
  __on_ui_event_name: ($) =>
    token(
      prec(
        1,
        new RegExp(
          `(${ON_WIDGET_EVENTS
            .slice()
            .sort((a, b) => b.length - a.length)
            .map(escapeRegex)
            .join("|")})`,
          "i",
        ),
      ),
    ),
  __on_ui_event: ($) =>
    choice(
      alias($.__on_ui_event_name, $.identifier),
      prec(-1, $.string_literal),
    ),
  __on_ui_events: ($) =>
    seq(
      field("event", $.__on_ui_event),
      repeat(seq(",", field("event", $.__on_ui_event))),
    ),
  __on_ui_event_widgets: ($) =>
    seq($.__on_ui_events, alias($.__on_of_phrase, $.of_phrase)),
  __on_of_phrase: ($) =>
    seq(
      kw("OF"),
      optional(field("of", kw("MENU-ITEM"))),
      field("widget", $.widget_phrase),
      repeat(
        seq(
          ",",
          optional(field("of", kw("MENU-ITEM"))),
          field("widget", $.widget_phrase),
        ),
      ),
    ),
  __on_referencing_phrase: ($) =>
    choice(
      seq(
        kw("NEW"),
        optional(kw("BUFFER")),
        field("new_record", $.identifier),
        kw("OLD"),
        optional(kw("BUFFER")),
        field("old_record", $.identifier),
      ),
      seq(kw("OLD"), optional(kw("VALUE")), field("old_field", $.identifier)),
    ),
});
