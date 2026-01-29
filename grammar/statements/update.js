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
        alias($.__update_at_phrase, $.at_phrase),
      ),
      tkw("SKIP"),
    ),
  __update_field_target: ($) => choice($.identifier, $.qualified_name),
  __update_format_phrase: ($) =>
    seq(alias($.__update_format_option, $.format_option)),
  __update_format_option: ($) =>
    seq(
      kw("FORMAT"),
      $._escaped_string,
      optional(
        token.immediate(/:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i),
      ),
    ),
  __update_at_phrase: ($) => seq(kw("AT"), token(/[0-9]+(\.[0-9]+)?/)),
  __update_editing_phrase: ($) =>
    seq(tkw("EDITING"), $._colon, repeat1($._statement), tkw("END")),
  __update_go_on: ($) => seq(tkw("GO-ON"), "(", repeat1($.identifier), ")"),
  __update_frame_phrase: ($) =>
    seq(kw("WITH"), optional(seq(kw("FRAME"), field("frame", $.identifier)))),
});
