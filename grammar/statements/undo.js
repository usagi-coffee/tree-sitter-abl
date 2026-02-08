module.exports = ({ kw }) => ({
  undo_statement: ($) => seq(kw("UNDO"), optional($.__undo_body), $._terminator),

  __undo_body: ($) =>
    seq(
      choice(
        seq(",", $.__undo_action),
        seq(
          field("undo_label", $.identifier),
          optional(seq(",", $.__undo_action)),
        ),
      ),
    ),

  __undo_action: ($) =>
    choice(
      seq(
        kw("THROW"),
        optional(
          field(
            "value",
            choice(
              $.new_expression,
              $._assignable,
              $.string_literal,
              $.number_literal,
            ),
          ),
        ),
      ),
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
      seq(
        kw("RETURN"),
        optional(
          choice(
            seq(kw("ERROR"), field("error_value", $._expression)),
            kw("NO-APPLY"),
            field("return_value", $._expression),
          ),
        ),
      ),
    ),
});
