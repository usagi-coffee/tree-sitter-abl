module.exports = ({ kw }) => ({
  can_find_expression: ($) =>
    seq(kw("CAN-FIND"), "(", $.__can_find_record_query, ")"),

  __can_find_record_query: ($) =>
    prec.right(
      seq(
        optional(choice(kw("FIRST"), kw("LAST"))),
        field("table", $.__record_query_record_name),
        optional(alias($.__record_query_of_phrase, $.of_phrase)),
        optional(alias($.__record_query_using_phrase, $.using_phrase)),
        optional(alias($.__record_query_frame_phrase, $.frame_phrase)),
        optional(alias($.__record_query_where_phrase, $.where_phrase)),
        optional(alias($.__record_query_lock_phrase, $.no_lock)),
        optional(alias($.__record_query_use_index, $.use_index)),
      ),
    ),

  __record_query_where_phrase: ($) => seq(kw("WHERE"), $._expression),
  __record_query_of_phrase: ($) =>
    seq(kw("OF"), field("record", $.__record_query_record_name)),
  __record_query_using_phrase: ($) =>
    seq(kw("USING"), field("index", $.__record_query_index_name)),
  __record_query_frame_phrase: ($) =>
    seq(
      kw("AND"),
      kw("FRAME"),
      optional(field("frame", $.identifier)),
      field("field", $.identifier),
    ),
  __record_query_lock_phrase: ($) => kw("NO-LOCK"),
  __record_query_use_index: ($) =>
    seq(kw("USE-INDEX"), field("index", $.__record_query_index_name)),

  __record_query_record_name: ($) => $._identifier_or_qualified_name,
  __record_query_index_name: ($) => $._identifier_or_qualified_name,
});
