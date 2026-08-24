export default ({ kw }) => ({
  undo_statement: ($) => seq($.__undo_prefix, $._terminator),

  __undo_prefix: ($) =>
    seq(
      kw("UNDO"),
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__undo_action)),
    ),

  __undo_action: ($) =>
    choice(
      seq(
        kw("THROW"),
        optional(
          field(
            "value",
            choice($.new_expression, $._assignable, $.string_literal, $.number_literal),
          ),
        ),
      ),
      $._undo_lnr_target,
      seq(
        kw("RETURN"),
        optional(
          choice(
            seq(kw("ERROR"), optional(field("error_value", $._expression))),
            alias(kw("NO-APPLY"), $.no_apply),
            field("return_value", $._expression),
          ),
        ),
      ),
    ),
});
