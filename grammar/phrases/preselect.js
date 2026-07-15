export default ({ kw }) => ({
  preselect_phrase: ($) =>
    seq(
      kw("PRESELECT"),
      $.preselect_record_list,
      optional(
        prec.right(
          seq(
            optional(kw("BREAK")),
            choice($.__preselect_by_phrase, $.__preselect_collate_phrase),
            repeat(choice($.__preselect_by_phrase, $.__preselect_collate_phrase)),
          ),
        ),
      ),
    ),

  __preselect_by_phrase: ($) =>
    seq(kw("BY"), field("by", $._expression), optional($.__preselect_sort_direction)),
  __preselect_collate_phrase: ($) => seq($._collate_body, optional($.__preselect_sort_direction)),
  __preselect_sort_direction: ($) => kw("DESCENDING", { offset: 4 }),
});
