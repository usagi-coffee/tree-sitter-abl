module.exports = ({ kw, tkw }) => ({
  update_statement: ($) => seq(tkw("UPDATE"), $.__update_body, $._terminator),

  __update_body: ($) =>
    seq(
      optional(tkw("UNLESS-HIDDEN")),
      repeat1(alias($.__update_item, $.update_item)),
      optional(alias($.__update_go_on, $.go_on_phrase)),
      optional(alias($.__update_frame_phrase, $.frame_phrase)),
      optional(alias($.__update_editing_phrase, $.editing_phrase)),
      optional(tkw("NO-ERROR")),
    ),
  __update_item: ($) =>
    choice(
      prec.right(
        seq(
          field("field", $.__update_field_target),
          optional(alias($.__update_format_phrase, $.format_phrase)),
          optional(seq(kw("WHEN"), field("when", $._expression))),
        ),
      ),
      seq(
        field("field", $.__update_field_target),
        "=",
        field("value", $._expression),
      ),
      seq(
        tkw("TEXT"),
        "(",
        token(/[A-Za-z_][A-Za-z0-9_-]*/),
        alias($.__update_format_phrase, $.format_phrase),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        optional(alias($.__update_at_phrase, $.at_phrase)),
      ),
      tkw("SKIP"),
    ),
  __update_field_target: ($) => choice($.identifier, $.qualified_name),
  __update_format_phrase: ($) =>
    repeat1(
      choice(
        alias($.__update_format_option, $.format_option),
        alias($.__update_validate_option, $.validate_option),
      ),
    ),
  __update_format_option: ($) =>
    seq(
      kw("FORMAT"),
      $._escaped_string,
      optional(
        token.immediate(/:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i),
      ),
    ),
  __update_validate_option: ($) =>
    seq(
      tkw("VALIDATE"),
      "(",
      field("condition", $._expression),
      ",",
      field("message", $._expression),
      ")",
    ),
  __update_at_phrase: ($) =>
    seq(choice(kw("AT"), kw("TO")), token(/[0-9]+(\.[0-9]+)?/)),
  __update_editing_phrase: ($) =>
    seq(tkw("EDITING"), $._colon, repeat1($._statement), tkw("END")),
  __update_go_on: ($) => seq(tkw("GO-ON"), "(", repeat1($.identifier), ")"),
  __update_frame_phrase: ($) =>
    seq(
      kw("WITH"),
      repeat(
        choice(
          seq(kw("FRAME"), field("frame", $.identifier)),
          seq($.number_literal, tkw("COLUMN")),
          seq($.number_literal, tkw("COLUMNS")),
          tkw("CENTERED"),
          seq(optional($.number_literal), tkw("DOWN")),
          seq(kw("TITLE"), $._expression),
          seq(kw("WIDTH"), $.number_literal),
          tkw("SIDE-LABELS"),
          tkw("NO-LABELS"),
          tkw("NO-BOX"),
          seq(kw("ROW"), $._expression),
          seq(kw("COLUMN"), $._expression),
        ),
      ),
    ),
});
