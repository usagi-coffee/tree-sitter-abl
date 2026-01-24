module.exports = ({ kw, tkw }) => ({
  for_each_statement: ($) =>
    prec(
      1,
      seq(
        optional(seq(field("label", $.identifier), $._colon)),
        kw("FOR"),
        choice($.for_record_list, $.for_variable_loop),
        optional(alias($.__for_while_phrase, $.while_phrase)),
        optional(tkw("TRANSACTION")),
        optional(alias($.__for_stop_after_phrase, $.stop_after_phrase)),
        // FIXME: this shouldn't be repeat but we need to save on state counts
        repeat(
          choice(
            alias($.__for_on_error_phrase, $.on_error_phrase),
            alias($.__for_on_endkey_phrase, $.on_endkey_phrase),
            alias($.__for_on_quit_phrase, $.on_quit_phrase),
            alias($.__for_on_stop_phrase, $.on_stop_phrase),
            alias($.__for_with_frame_phrase, $.with_frame_phrase),
          ),
        ),
        $.body,
        tkw("END"),
        $._terminator,
      ),
    ),

  for_record_list: ($) => seq($.for_record, repeat(seq(",", $.for_record))),

  for_record: ($) =>
    seq(
      optional(choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
      field("table", $.__for_record_name),
      optional(alias($.__for_of_phrase, $.of_phrase)),
      repeat($._for_record_option_or_where),
    ),

  _for_record_option: ($) =>
    choice(
      alias($.__for_no_lock, $.no_lock),
      alias($.__for_exclusive_lock, $.exclusive_lock),
      alias($.__for_share_lock, $.share_lock),
      alias($.__for_no_prefetch, $.no_prefetch),
      alias($.__for_by_phrase, $.by_phrase),
      alias($.__for_collate_phrase, $.collate_phrase),
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
    choice($._for_record_option, alias($.__for_where_phrase, $.where_phrase)),

  __for_where_phrase: ($) => seq(kw("WHERE"), $._expression),
  __for_of_phrase: ($) => seq(kw("OF"), $.__for_record_name),
  __for_record_name: ($) => choice($.identifier, $.qualified_name),
  __for_no_lock: ($) => tkw("NO-LOCK"),
  __for_exclusive_lock: ($) => tkw("EXCLUSIVE-LOCK"),
  __for_share_lock: ($) => tkw("SHARE-LOCK"),
  __for_no_prefetch: ($) => tkw("NO-PREFETCH"),
  __for_by_phrase: ($) =>
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
  __for_on_error_phrase: ($) =>
    seq(
      kw("ON"),
      kw("ERROR"),
      tkw("UNDO"),
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__for_on_error_action)),
    ),

  __for_on_error_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      tkw("THROW"),
      $.__for_on_error_return,
    ),

  __for_on_error_return: ($) =>
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
  __for_on_endkey_phrase: ($) =>
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
  __for_with_frame_phrase: ($) =>
    seq(
      kw("WITH"),
      kw("FRAME"),
      optional(field("name", $.identifier)),
      optional(seq(kw("WIDTH"), $.number_literal)),
    ),
  __for_sort_direction: ($) => token(/ASC(ENDING)?|DESC(ENDING)?/i),

  __for_collate_phrase: ($) =>
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

  __for_while_phrase: ($) =>
    seq(kw("WHILE"), field("condition", $._expression)),

  __for_stop_after_phrase: ($) =>
    seq(kw("STOP-AFTER"), field("time", $._expression)),

  __for_on_quit_phrase: ($) =>
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

  __for_on_stop_phrase: ($) =>
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
