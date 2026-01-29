module.exports = ({ kw, tkw }) => ({
  raw_transfer_statement: ($) =>
    seq(tkw("RAW-TRANSFER"), $.__raw_transfer_body, $._terminator),

  __raw_transfer_body: ($) =>
    seq(
      choice(
        seq(
          field("source_field", $.identifier),
          kw("TO"),
          field("target", $.identifier),
        ),
        seq(
          kw("FIELD"),
          field("source_field", $._expression),
          kw("TO"),
          field("target_field", $._expression),
        ),
      ),
      optional(tkw("NO-ERROR")),
    ),
});
