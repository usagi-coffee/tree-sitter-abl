module.exports = ({ kw }) => ({
  apply_statement: ($) => seq(kw("APPLY"), $.__apply_body, $._terminator),

  __apply_body: ($) =>
    seq(
      field("event", $._events),
      optional(
        seq(
          kw("TO"),
          field(
            "to",
            alias(
              choice(
                $.widget_phrase,
                seq($._widgets, optional(field("handle", $.identifier))),
              ),
              $.widget,
            ),
          ),
        ),
      ),
    ),
});
