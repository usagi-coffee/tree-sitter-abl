module.exports = ({ kw }) => ({
  put_statement: ($) => seq(kw("PUT"), $.__put_body, $._terminator),

  __put_body: ($) =>
    seq(
      optional(
        choice(
          alias($.__put_stream_phrase, $.stream_phrase),
          alias($.__put_stream_handle_phrase, $.stream_handle_phrase),
        ),
      ),
      choice(
        seq(optional(kw("UNFORMATTED")), repeat1($.__put_item)),
        seq(kw("CONTROL"), repeat1(field("control", $._expression))),
      ),
    ),

  __put_stream_phrase: ($) => seq(kw("STREAM"), field("name", $.identifier)),
  __put_stream_handle_phrase: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),

  __put_item: ($) =>
    choice(
      $.__put_expression_item,
      alias($.__put_skip_item, $.skip),
      alias($.__put_space_item, $.space),
    ),

  __put_expression_item: ($) =>
    seq(
      field("value", $._expression),
      optional($.format_phrase),
      optional(
        seq(choice(kw("AT"), kw("TO")), field("position", $._expression)),
      ),
    ),

  __put_skip_item: ($) =>
    prec.right(
      seq(kw("SKIP"), optional(seq("(", field("count", $._expression), ")"))),
    ),

  __put_space_item: ($) =>
    prec.right(
      seq(kw("SPACE"), optional(seq("(", field("count", $._expression), ")"))),
    ),
});
