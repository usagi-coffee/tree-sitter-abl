export default ({ kw }) => ({
  // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
  preselect_phrase: ($) =>
    seq(
      kw("PRESELECT"),
      $.preselect_record_list,
      optional(
        prec.right(
          seq(
            optional(kw("BREAK")),
            // oxlint-disable-next-line tree-sitter-optimize/recurse
            repeat1(
              choice(
                seq(
                  $._by_keyword,
                  field("by", $._expression),
                  optional(kw("DESCENDING", { offset: 4 })),
                ),
                seq($._collate_body, optional(kw("DESCENDING", { offset: 4 }))),
              ),
            ),
          ),
        ),
      ),
    ),
});
