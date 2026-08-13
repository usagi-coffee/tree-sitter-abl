export default ({ kw }) => ({
  preselect_phrase: ($) =>
    seq(
      kw("PRESELECT"),
      $.preselect_record_list,
      optional(
        prec.right(
          seq(
            optional(kw("BREAK")),
            repeat1(
              choice(
                seq(
                  kw("BY"),
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
