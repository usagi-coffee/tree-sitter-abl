module.exports = ({ kw, tkw }) => ({
  repeat_statement: ($) =>
    seq(
      optional(seq(field("label", $.identifier), ":")),
      tkw("REPEAT"),
      $.__repeat_body,
      $._terminator,
    ),

  __repeat_body: ($) =>
    seq(
      optional(
        choice(
          seq(
            kw("FOR"),
            field("record", $.identifier),
            repeat(seq(",", field("record", $.identifier))),
          ),
          seq(choice(kw("WHILE"), kw("UNTIL")), $._expression),
          seq(kw("PRESELECT"), $.preselect_record_list),
        ),
      ),
      // FIXME: this shouldn't be repeat but we need to save on state counts
      repeat(
        choice(
          $.on_endkey_phrase,
          $.on_stop_phrase,
          $.on_error_phrase,
          $.on_quit_phrase,
          $.frame_phrase,
        ),
      ),
      $.body,
      tkw("END"),
    ),



  __repeat_undo_phrase: ($) =>
    seq(
      tkw("UNDO"),
      ",",
      choice(
        seq(
          tkw("RETURN"),
          tkw("ERROR"),
          $._escaped_string,
          optional(
            token.immediate(
              /:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i,
            ),
          ),
        ),
        tkw("THROW"),
        tkw("LEAVE"),
        tkw("NEXT"),
        tkw("RETRY"),
        seq(tkw("RETURN"), tkw("NO-APPLY")),
        seq(
          tkw("RETURN"),
          $._escaped_string,
          optional(
            token.immediate(
              /:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i,
            ),
          ),
        ),
      ),
    ),
  __repeat_undo_throw_phrase: ($) => seq(tkw("UNDO"), ",", tkw("THROW")),
  __repeat_undo_return_error: ($) =>
    seq(tkw("UNDO"), ",", tkw("RETURN"), tkw("ERROR"), $.new_expression),
});
