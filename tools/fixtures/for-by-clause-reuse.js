export default ({ kw }) => ({
  __for_by_phrase: ($) => prec.right($.__for_by_clause),
  __for_group_by_phrase: ($) => prec.right(seq($._kw_group, $.__for_by_clause)),
  __for_break_by: ($) => prec.right(seq($._kw_break, $.__for_by_clause)),
  __for_by_clause: ($) =>
    seq($._kw_by, prec.right(seq($.__for_by_item, optional($.__for_by_items_tail)))),
  __for_by_items_tail: ($) =>
    prec.right(seq($._kw_by, $.__for_by_item, optional($.__for_by_items_tail))),
  __for_by_item: ($) =>
    seq(field("by", $._expression), optional(field("sort_order", kw("DESCENDING", { offset: 4 })))),
});
