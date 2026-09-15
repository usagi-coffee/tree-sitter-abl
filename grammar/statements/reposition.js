export default ({ kw }) => ({
  reposition_statement: ($) => seq($.__reposition_prefix, $._terminator),

  __reposition_prefix: ($) => seq(kw("REPOSITION"), $.__reposition_body),
  __reposition_body: ($) =>
    seq(
      field("query", $.identifier),
      choice(
        seq(
          $._to_keyword,
          choice(
            // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction, tree-sitter-optimize/list-head-extraction
            seq(
              kw("ROWID"),
              field("rowid", $._expression),
              optional($.__reposition_rowid_tail),
              optional($.__reposition_tenant_no_error_tail),
            ),
            seq(kw("RECID"), field("recid", $._expression), optional($.__no_error)),
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
            seq($._row_keyword, field("row", $._expression)),
          ),
        ),
        seq(
          alias(kw("FORWARDS", { alias: "FORWARD", offset: 7 }), $.forwards),
          field("count", $._expression),
        ),
        seq(
          alias(kw("BACKWARDS", { alias: "BACKWARD", offset: 8 }), $.backwards),
          field("count", $._expression),
        ),
      ),
    ),
  __reposition_rowid_tail: ($) =>
    seq(",", field("rowid", $._expression), optional($.__reposition_rowid_tail)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __reposition_tenant_no_error_tail: ($) =>
    choice(
      seq($._for_keyword, kw("TENANT"), field("tenant", $._expression), optional($.__no_error)),
      $.__no_error,
    ),
});
