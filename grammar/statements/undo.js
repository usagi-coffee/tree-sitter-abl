module.exports = ({ tkw }) => ({
  undo_statement: ($) => seq(tkw("UNDO"), $.__undo_body, $._terminator),

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
        tkw("THROW"),
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
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      seq(
        tkw("RETURN"),
        optional(
          choice(
            seq(tkw("ERROR"), field("error_value", $._expression)),
            tkw("NO-APPLY"),
            field("return_value", $._expression),
          ),
        ),
      ),
    ),
});
