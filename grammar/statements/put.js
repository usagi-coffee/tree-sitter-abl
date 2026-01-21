module.exports = ({ kw, tkw }) => ({
  put_statement: ($) =>
    seq(
      kw("PUT"),
      optional(
        choice(
          alias($.__put_stream_clause, $.stream_clause),
          alias($.__put_stream_handle_clause, $.stream_handle_clause),
        ),
      ),
      choice(
        seq(optional(kw("UNFORMATTED")), repeat1($.__put_item)),
        seq(kw("CONTROL"), repeat1(field("control", $._expression))),
      ),
      $._terminator,
    ),

  __put_stream_clause: ($) => seq(kw("STREAM"), field("name", $.identifier)),
  __put_stream_handle_clause: ($) =>
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
      optional(seq(kw("FORMAT"), field("format", $.string_literal))),
      optional(
        seq(
          choice(kw("AT"), kw("TO")),
          field("position", $._expression),
        ),
      ),
    ),
  __put_skip_item: ($) =>
    choice(
      seq(alias(token(/SKIP\(/i), "SKIP"), field("count", $._expression), ")"),
      tkw("SKIP"),
    ),
  __put_space_item: ($) =>
    choice(
      seq(token(/SPACE\(/i), field("count", $._expression), ")"),
      token(/SPACE/i),
    ),
});
