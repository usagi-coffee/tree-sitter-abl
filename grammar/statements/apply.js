export default ({ kw }) => ({
  apply_statement: ($) => seq($.__apply_prefix, $._terminator),

  __apply_prefix: ($) =>
    seq(
      kw("APPLY"),
      field("event", choice($._events, $.object_access, $.qualified_name, $.array_access)),
      optional(
        seq(
          $._to_keyword,
          field(
            "to",
            alias(
              choice($.widget_phrase, seq($._widgets, optional(field("handle", $.identifier)))),
              $.widget,
            ),
          ),
          optional($.__apply_in_widget),
        ),
      ),
    ),

  __apply_in_widget: ($) =>
    seq(
      $._in_keyword,
      choice(
        seq(kw("BROWSE"), field("browse", $.identifier)),
        seq(kw("FRAME", { offset: 4 }), field("frame", $.identifier)),
        seq(kw("MENU"), field("menu", $.identifier)),
      ),
    ),
});
