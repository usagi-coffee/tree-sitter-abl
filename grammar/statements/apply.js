export default ({ kw }) => ({
  apply_statement: ($) => seq($.__apply_prefix, $._terminator),

  __apply_prefix: ($) =>
    seq(
      kw("APPLY"),
      // `APPLY LAST-EVENT:FUNCTION TO SELF.` -- the event is named by reading
      // it off a handle as often as it is written out, and only the literal
      // event list was read.
      field("event", choice($._events, $.object_access)),
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
