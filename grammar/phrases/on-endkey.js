module.exports = ({ kw }) => ({
  on_endkey_phrase: ($) =>
    seq(
      kw("ON"),
      kw("ENDKEY"),
      kw("UNDO"),
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__on_endkey_action)),
    ),
  __on_endkey_action: ($) =>
    choice(
      seq(kw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(kw("NEXT"), optional(field("next_label", $.identifier))),
      seq(kw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__on_endkey_return,
    ),
  __on_endkey_return: ($) =>
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
