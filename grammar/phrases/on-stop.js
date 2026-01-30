module.exports = ({ kw, tkw }) => ({
  on_stop_phrase: ($) =>
    seq(
      kw("ON"),
      kw("STOP"),
      tkw("UNDO"),
      optional(field("undo_label", $.identifier)),
      ",",
      $.__on_stop_action,
    ),
  __on_stop_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__on_stop_return,
    ),
  __on_stop_return: ($) =>
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
