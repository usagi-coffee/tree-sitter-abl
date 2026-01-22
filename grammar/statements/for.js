module.exports = ({ kw, tkw }) => ({
  for_each_statement: ($) =>
    prec(
      1,
      seq(
        optional(seq(field("label", $.identifier), $._colon)),
        kw("FOR"),
        choice($.for_record_list, $.for_variable_loop),
        optional(alias($.__for_while_clause, $.while_clause)),
        optional(tkw("TRANSACTION")),
        optional(alias($.__for_stop_after_clause, $.stop_after_clause)),
        optional(alias($.__for_on_error_clause, $.on_error_clause)),
        optional(alias($.__for_on_endkey_clause, $.on_endkey_clause)),
        optional(alias($.__for_on_quit_clause, $.on_quit_clause)),
        optional(alias($.__for_on_stop_clause, $.on_stop_clause)),
        optional(alias($.__for_with_frame_clause, $.with_frame_clause)),
        $.body,
        tkw("END"),
        $._terminator,
      ),
    ),

  for_record_list: ($) =>
    seq($.for_record, repeat(seq(",", $.for_record))),

  for_record: ($) =>
    seq(
      optional(choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
      field("table", $.__for_record_name),
      optional(alias($.__for_of_clause, $.of_clause)),
      repeat($._for_record_option_or_where),
    ),

  _for_record_option: ($) =>
    choice(
      alias($.__for_no_lock, $.no_lock),
      alias($.__for_exclusive_lock, $.exclusive_lock),
      alias($.__for_share_lock, $.share_lock),
      alias($.__for_no_prefetch, $.no_prefetch),
      alias($.__for_by_clause, $.by_clause),
      alias($.__for_collate_clause, $.collate_clause),
      alias($.__for_use_index, $.use_index),
      alias($.__for_break_by, $.break_by),
    ),

  for_variable_loop: ($) =>
    seq(
      field("variable", $.identifier),
      "=",
      field("start", $._expression),
      kw("TO"),
      field("end", $._expression),
      optional(seq(kw("BY"), field("step", $._expression))),
    ),

  _for_record_option_or_where: ($) =>
    choice($._for_record_option, alias($.__for_where_clause, $.where_clause)),

  __for_undo_throw_phrase: ($) => seq(tkw("UNDO"), ",", tkw("THROW")),
  __for_where_clause: ($) => seq(kw("WHERE"), $._expression),
  __for_of_clause: ($) => seq(kw("OF"), $.__for_record_name),
  __for_record_name: ($) => choice($.identifier, $.qualified_name),
  __for_no_lock: ($) => tkw("NO-LOCK"),
  __for_exclusive_lock: ($) => tkw("EXCLUSIVE-LOCK"),
  __for_share_lock: ($) => tkw("SHARE-LOCK"),
  __for_no_prefetch: ($) => tkw("NO-PREFETCH"),
  __for_by_clause: ($) =>
    prec.right(
      seq(
        kw("BY"),
        $._expression,
        optional($.__for_sort_direction),
        repeat(seq(kw("BY"), $._expression, optional($.__for_sort_direction))),
      ),
    ),

  __for_use_index: ($) =>
    choice(
      seq(kw("USE-INDEX"), field("index", $.__for_index_name)),
      tkw("TABLE-SCAN"),
    ),

  __for_break_by: ($) =>
    prec.right(
      seq(
        kw("BREAK"),
        kw("BY"),
        $._expression,
        optional($.__for_sort_direction),
        repeat(seq(kw("BY"), $._expression, optional($.__for_sort_direction))),
      ),
    ),

  __for_index_name: ($) => choice($.identifier, $.qualified_name),
  __for_on_error_clause: ($) =>
    seq(
      kw("ON"),
      kw("ERROR"),
      alias($.__for_undo_throw_phrase, $.undo_throw_phrase),
    ),
  __for_on_endkey_clause: ($) =>
    seq(kw("ON"), kw("ENDKEY"), alias($.__for_on_endkey_undo, $.undo_phrase)),
  __for_on_endkey_undo: ($) =>
    seq(
      tkw("UNDO"),
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__for_on_endkey_action)),
    ),
  __for_on_endkey_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__for_on_endkey_return,
    ),
  __for_on_endkey_return: ($) =>
    seq(
      tkw("RETURN"),
      optional(
        choice(
          seq(tkw("ERROR"), optional(field("error_value", $._expression))),
          tkw("NO-APPLY"),
          field("return_value", $._expression),
        ),
      ),
    ),
  __for_with_frame_clause: ($) =>
    seq(
      kw("WITH"),
      kw("FRAME"),
      optional(field("name", $.identifier)),
      optional(seq(kw("WIDTH"), $.number_literal)),
    ),
  __for_sort_direction: ($) =>
    token(/ASC(ENDING)?|DESC(ENDING)?/i),

  __for_collate_clause: ($) =>
    seq(
      kw("COLLATE"),
      "(",
      field("string", $._expression),
      ",",
      field("strength", $._expression),
      optional(seq(",", field("collation", $._expression))),
      ")",
      optional($.__for_sort_direction),
    ),

  __for_while_clause: ($) => seq(kw("WHILE"), field("condition", $._expression)),

  __for_stop_after_clause: ($) =>
    seq(kw("STOP-AFTER"), field("time", $._expression)),

  __for_on_quit_clause: ($) =>
    seq(
      kw("ON"),
      kw("QUIT"),
      optional(seq(tkw("UNDO"), optional(field("undo_label", $.identifier)))),
      optional(seq(",", $.__for_on_quit_action)),
    ),

  __for_on_quit_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__for_on_quit_return,
    ),

  __for_on_quit_return: ($) =>
    seq(
      tkw("RETURN"),
      optional(
        choice(
          seq(tkw("ERROR"), optional(field("error_value", $._expression))),
          tkw("NO-APPLY"),
          field("return_value", $._expression),
        ),
      ),
    ),

  __for_on_stop_clause: ($) =>
    seq(
      kw("ON"),
      kw("STOP"),
      tkw("UNDO"),
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__for_on_stop_action)),
    ),

  __for_on_stop_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__for_on_stop_return,
    ),

  __for_on_stop_return: ($) =>
    seq(
      tkw("RETURN"),
      optional(
        choice(
          seq(tkw("ERROR"), optional(field("error_value", $._expression))),
          tkw("NO-APPLY"),
          field("return_value", $._expression),
        ),
      ),
    ),
});
