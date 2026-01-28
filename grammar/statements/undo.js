module.exports = ({ tkw }) => ({
  undo_statement: ($) =>
    seq(
      tkw("UNDO"),
      ",",
      choice(
        seq(
          tkw("THROW"),
          field(
            "value",
            choice($._assignable, $.string_literal, $.number_literal),
          ),
        ),
        seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
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
      $._terminator,
    ),
});
