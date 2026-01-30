module.exports = ({ kw, tkw }) => ({
  on_error_phrase: ($) =>
    seq(
      kw("ON"),
      kw("ERROR"),
      tkw("UNDO"),
      optional(field("undo_label", $.identifier)),
      ",",
      $.__on_error_action,
    ),
  __on_error_action: ($) =>
    choice(
      seq(tkw("THROW"), optional(field("throw_value", $._expression))),
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__on_error_return,
    ),
  __on_error_return: ($) =>
    seq(
      tkw("RETURN"),
      optional(
        choice(
          seq(tkw("ERROR"), optional(field("error_value", $._expression))),
          tkw("NO-APPLY"),
          field("return_value", $._expression),
        ),
      ),
    ),
});
