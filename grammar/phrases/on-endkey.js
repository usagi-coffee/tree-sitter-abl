module.exports = ({ kw, tkw }) => ({
  on_endkey_phrase: ($) =>
    seq(
      kw("ON"),
      kw("ENDKEY"),
      tkw("UNDO"),
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__on_endkey_action)),
    ),
  __on_endkey_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__on_endkey_return,
    ),
  __on_endkey_return: ($) =>
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
