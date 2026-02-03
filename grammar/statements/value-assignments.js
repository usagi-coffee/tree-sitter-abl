module.exports = ({ kw }) => ({
  current_language_statement: ($) =>
    seq(kw("CURRENT-LANGUAGE"), "=", $._expression, $._terminator),

  current_value_statement: ($) =>
    seq(
      kw("CURRENT-VALUE"),
      "(",
      field("sequence", $._expression),
      optional(
        seq(
          ",",
          field("database", $._expression),
          optional(seq(",", field("tenant", $._expression))),
        ),
      ),
      ")",
      "=",
      field("value", $._expression),
      $._terminator,
    ),

  dynamic_current_value_statement: ($) =>
    seq(
      kw("DYNAMIC-CURRENT-VALUE"),
      "(",
      field("sequence", $._expression),
      optional(
        seq(
          ",",
          field("database", $._expression),
          optional(seq(",", field("tenant", $._expression))),
        ),
      ),
      ")",
      "=",
      field("value", $._expression),
      $._terminator,
    ),

  dynamic_property_statement: ($) =>
    seq(
      kw("DYNAMIC-PROPERTY"),
      "(",
      field("object", $._expression),
      ",",
      field("property", $._expression),
      ")",
      "=",
      field("value", $._expression),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),

  frame_value_statement: ($) =>
    seq(
      kw("FRAME-VALUE"),
      "=",
      field("value", $._expression),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),

  entry_statement: ($) =>
    seq(
      kw("ENTRY"),
      "(",
      field("element", $._expression),
      ",",
      field("list", $._expression),
      optional(seq(",", field("delimiter", $._expression))),
      ")",
      "=",
      field("value", $._expression),
      $._terminator,
    ),

  length_statement: ($) =>
    seq(
      kw("LENGTH"),
      "(",
      field("value", $._expression),
      ")",
      "=",
      field("length", $._expression),
      $._terminator,
    ),

  raw_statement: ($) =>
    seq(
      kw("RAW"),
      "(",
      field("field", $._expression),
      optional(
        seq(
          ",",
          field("position", $._expression),
          optional(seq(",", field("length", $._expression))),
        ),
      ),
      ")",
      "=",
      field("value", $._expression),
      $._terminator,
    ),

  substring_statement: ($) =>
    seq(
      kw("SUBSTRING"),
      "(",
      field("string", $._expression),
      ",",
      field("position", $._expression),
      optional(seq(",", field("length", $._expression))),
      ")",
      "=",
      field("value", $._expression),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),
});
