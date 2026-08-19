export default ({ kw }) => ({
  apply_statement: ($) => seq($.__apply_prefix, $._terminator),

  __apply_prefix: ($) =>
    seq(
      kw("APPLY"),
      // `APPLY LAST-EVENT:FUNCTION TO SELF.` -- the event is named by reading
      // it off a handle as often as it is written out, and only the literal
      // event list was read.
      //
      // `APPLY tt.nom TO FOCUS.` reads it out of a field, and `APPLY ev[i]` out
      // of an array. The reference calls the event "an expression whose value is
      // the key code or event name", so both are legal. It stops short of the
      // whole expression grammar on purpose: an operator after the event cannot
      // be told from one continuing it, and the two readings would need a
      // declared conflict for a form nothing writes.
      field("event", choice($._events, $.object_access, $.qualified_name, $.array_access)),
      optional(
        seq(
          kw("TO"),
          field(
            "to",
            alias(
              choice($.widget_phrase, seq($._widgets, optional(field("handle", $.identifier)))),
              $.widget,
            ),
          ),
          // `APPLY "entry" TO SELF IN BROWSE bw.` -- the target may be
          // qualified by the browse or frame it sits in.
          optional($.__apply_in_widget),
        ),
      ),
    ),

  __apply_in_widget: ($) =>
    seq(
      kw("IN"),
      choice(
        seq(kw("BROWSE"), field("browse", $.identifier)),
        seq(kw("FRAME", { offset: 4 }), field("frame", $.identifier)),
        seq(kw("MENU"), field("menu", $.identifier)),
      ),
    ),
});
