module.exports = ({ kw }) => ({
  apply_statement: ($) => seq($.__apply_prefix, $._terminator),

  __apply_prefix: ($) => seq(kw("APPLY"), $.__apply_body),
  __apply_body: ($) =>
    seq(
      field("event", $._events),
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
        ),
      ),
    ),
});
