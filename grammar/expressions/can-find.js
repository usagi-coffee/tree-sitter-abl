module.exports = ({ kw }) => ({
  can_find_expression: ($) => seq($.__can_find_prefix, "(", $.__can_find_record_query, ")"),

  __can_find_prefix: ($) => kw("CAN-FIND"),

  __can_find_record_query: ($) =>
    prec.right(
      seq(
        optional(choice(kw("FIRST"), kw("LAST"))),
        field("table", $._identifier_or_qualified_name),
        optional($.__record_query_options),
      ),
    ),

  __record_query_options: ($) =>
    choice(
      seq(alias($.__record_query_of_phrase, $.of_phrase), optional($.__record_query_after_of)),
      seq(
        alias($.__record_query_using_phrase, $.using_phrase),
        optional($.__record_query_after_using),
      ),
      seq(
        alias($.__record_query_frame_phrase, $.frame_phrase),
        optional($.__record_query_after_frame),
      ),
      $.__record_query_where_or_lock,
      $.__record_query_use_index,
    ),
  __record_query_after_of: ($) =>
    choice(
      seq(
        alias($.__record_query_using_phrase, $.using_phrase),
        optional($.__record_query_after_using),
      ),
      seq(
        alias($.__record_query_frame_phrase, $.frame_phrase),
        optional($.__record_query_after_frame),
      ),
      $.__record_query_where_or_lock,
      $.__record_query_use_index,
    ),
  __record_query_after_using: ($) =>
    choice(
      seq(
        alias($.__record_query_frame_phrase, $.frame_phrase),
        optional($.__record_query_after_frame),
      ),
      $.__record_query_where_or_lock,
      $.__record_query_use_index,
    ),
  __record_query_after_frame: ($) =>
    choice($.__record_query_where_or_lock, $.__record_query_use_index),
  __record_query_where_or_lock: ($) =>
    choice(
      seq(
        alias($.__record_query_where_phrase, $.where_phrase),
        optional($.__record_query_after_where),
      ),
      seq(alias($.__record_query_lock_phrase, $.no_lock), optional($.__record_query_after_lock)),
    ),
  __record_query_after_where: ($) =>
    choice(
      seq(alias($.__record_query_lock_phrase, $.no_lock), optional($.__record_query_use_index)),
      $.__record_query_use_index,
    ),
  __record_query_after_lock: ($) =>
    choice(
      seq(
        alias($.__record_query_where_phrase, $.where_phrase),
        optional($.__record_query_use_index),
      ),
      $.__record_query_use_index,
    ),

  __record_query_where_phrase: ($) => seq(kw("WHERE"), optional($._expression)),
  __record_query_of_phrase: ($) => seq(kw("OF"), field("record", $._identifier_or_qualified_name)),
  __record_query_using_phrase: ($) =>
    seq(kw("USING"), field("index", $._identifier_or_qualified_name)),
  __record_query_frame_phrase: ($) =>
    seq(
      kw("AND"),
      kw("FRAME"),
      optional(field("frame", $.identifier)),
      field("field", $.identifier),
    ),
  __record_query_lock_phrase: ($) => kw("NO-LOCK"),
  __record_query_use_index: ($) =>
    seq(kw("USE-INDEX"), field("index", $._identifier_or_qualified_name)),
});
