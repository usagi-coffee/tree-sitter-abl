module.exports = ({ kw, tkw }) => ({
  can_find_expression: ($) => seq(tkw("CAN-FIND"), "(", $.record_query, ")"),

  record_query: ($) =>
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
  __record_query_lock_phrase: ($) => tkw("NO-LOCK"),
  __record_query_use_index: ($) =>
    seq(kw("USE-INDEX"), field("index", $.__record_query_index_name)),

  __record_query_record_name: ($) => choice($.identifier, $.qualified_name),
  __record_query_index_name: ($) => choice($.identifier, $.qualified_name),
});
