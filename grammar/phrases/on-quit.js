module.exports = ({ kw, tkw }) => ({
  on_quit_phrase: ($) =>
    seq(
      kw("ON"),
      tkw("QUIT"),
      optional(seq(tkw("UNDO"), optional(field("undo_label", $.identifier)))),
      optional(seq(",", $.__on_quit_action)),
    ),
  __on_quit_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__on_quit_return,
    ),
  __on_quit_return: ($) =>
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
