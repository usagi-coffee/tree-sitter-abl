export default ({ kw }) => ({
  undo_statement: ($) => seq($.__undo_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-optional-sequence
  __undo_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_undo,
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__undo_action)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/single-use-choice
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
        $._kw_return,
        optional(
          choice(
            $.__return_error_clause,
            alias(kw("NO-APPLY"), $.no_apply),
            field("return_value", $._expression),
          ),
        ),
      ),
    ),
});
