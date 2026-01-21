module.exports = ({ tkw }) => ({
  undo_statement: ($) =>
    prec(
      1,
      choice(
        seq(
          tkw("UNDO"),
          optional(field("label", $.identifier)),
          ",",
          choice(
            seq(
              tkw("THROW"),
              field("value", choice($.new_expression, $._expression)),
            ),
            seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
          ),
          $._terminator,
        ),
        seq(
          tkw("UNDO"),
          ",",
          tkw("LEAVE"),
          optional(field("leave_label", $.identifier)),
          $._terminator,
        ),
      ),
    ),
});
