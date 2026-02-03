module.exports = ({ kw }) => ({
  preselect_phrase: ($) =>
    seq(
      kw("PRESELECT"),
      $.preselect_record_list,
      optional($.__preselect_break_by_phrase),
    ),

  __preselect_break_by_phrase: ($) =>
    prec.right(
      seq(
        optional(kw("BREAK")),
        choice($.__preselect_by_phrase, $.__preselect_collate_phrase),
        repeat(
          choice($.__preselect_by_phrase, $.__preselect_collate_phrase),
        ),
      ),
    ),
  __preselect_by_phrase: ($) =>
    seq(
      kw("BY"),
      field("by", $._expression),
      optional($.__preselect_sort_direction),
    ),
  __preselect_collate_phrase: ($) =>
    seq(
      kw("COLLATE"),
      "(",
      field("string", $._expression),
      ",",
      field("strength", $._expression),
      optional(seq(",", field("collation", $._expression))),
      ")",
      optional($.__preselect_sort_direction),
    ),
  __preselect_sort_direction: ($) => token(/ASC(ENDING)?|DESC(ENDING)?/i),
});
