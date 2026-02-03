module.exports = ({ kw }) => ({
  on_error_phrase: ($) =>
    seq(
      kw("ON"),
      kw("ERROR"),
      kw("UNDO"),
      optional(field("undo_label", $.identifier)),
      ",",
      $.__on_error_action,
    ),

  __on_error_action: ($) =>
    choice(
      seq(kw("THROW"), optional(field("throw_value", $._expression))),
      seq(
        kw("LEAVE"),
        optional(field("leave_label", $.identifier)),
      ),
      seq(
        kw("NEXT"),
        optional(field("next_label", $.identifier)),
      ),
      seq(
        kw("RETRY"),
        optional(field("retry_label", $.identifier)),
      ),
      $.__on_error_return,
    ),

  __on_error_return: ($) =>
    seq(
      kw("RETURN"),
      optional(
        choice(
          seq(kw("ERROR"), optional(field("error_value", $._expression))),
          kw("NO-APPLY"),
          field("return_value", $._expression),
        ),
      ),
    ),
});
