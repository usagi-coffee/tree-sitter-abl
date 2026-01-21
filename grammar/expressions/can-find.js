module.exports = ({ op }) => ({
  can_find_expression: ($) =>
    seq(token(/CAN-FIND/i), "(", $.record_query, ")"),

  record_query: ($) =>
    prec.right(
      seq(
        optional(choice(op("FIRST"), op("LAST"))),
        field("table", $.__record_query_record_name),
        alias($.__record_query_where_clause, $.where_clause),
        optional(alias($.__record_query_use_index, $.use_index)),
      ),
    ),

  __record_query_where_clause: ($) => seq(op("WHERE"), $._expression),
  __record_query_use_index: ($) =>
    seq(op("USE-INDEX"), field("index", $.__record_query_index_name)),

  __record_query_record_name: ($) => choice($.identifier, $.qualified_name),
  __record_query_index_name: ($) => choice($.identifier, $.qualified_name),
});
