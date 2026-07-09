module.exports = ({ kw }) => ({
  raw_transfer_statement: ($) => seq($.__raw_transfer_prefix, $._no_error_terminator),

  __raw_transfer_prefix: ($) =>
    seq(
      kw("RAW-TRANSFER"),
      choice(
        // Case 1: source TO target (basic)
        seq(field("source_field", $.identifier), kw("TO"), field("target", $.identifier)),
        // Case 2: FIELD source TO target
        seq(
          kw("FIELD"),
          field("source_field", $._expression),
          kw("TO"),
          field("target_field", $._expression),
        ),
        // Case 3: BUFFER source TO target
        seq(
          kw("BUFFER"),
          field("source_field", $.identifier),
          kw("TO"),
          field("target", $.identifier),
        ),
        // Case 4: BUFFER source TO FIELD target
        seq(
          kw("BUFFER"),
          field("source_field", $.identifier),
          kw("TO"),
          kw("FIELD"),
          field("target_field", $.identifier),
        ),
        // Case 5: FIELD source TO BUFFER target
        seq(
          kw("FIELD"),
          field("source_field", $._expression),
          kw("TO"),
          kw("BUFFER"),
          field("target_field", $._expression),
        ),
        // Case 6: BUFFER source TO BUFFER target
        seq(
          kw("BUFFER"),
          field("source_field", $.identifier),
          kw("TO"),
          kw("BUFFER"),
          field("target_field", $.identifier),
        ),
      ),
    ),
});
