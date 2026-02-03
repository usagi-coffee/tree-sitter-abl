module.exports = ({ kw }) => ({
  value_assignment_statement: ($) =>
    seq(
      choice(
        $.__value_assignment_current_language,
        $.__value_assignment_current_value,
        $.__value_assignment_dynamic_current_value,
        $.__value_assignment_dynamic_property,
        $.__value_assignment_frame_value,
        $.__value_assignment_entry,
        $.__value_assignment_length,
        $.__value_assignment_raw,
        $.__value_assignment_substring,
      ),
      $._terminator,
    ),

  __value_assignment_current_language: ($) =>
    seq(
      field("type", alias(kw("CURRENT-LANGUAGE"), $.identifier)),
      "=",
      field("value", $._expression),
    ),

  __value_assignment_current_value: ($) =>
    seq(
      field("type", alias(kw("CURRENT-VALUE"), $.identifier)),
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
    ),

  __value_assignment_dynamic_current_value: ($) =>
    seq(
      field("type", alias(kw("DYNAMIC-CURRENT-VALUE"), $.identifier)),
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
    ),

  __value_assignment_dynamic_property: ($) =>
    seq(
      field("type", alias(kw("DYNAMIC-PROPERTY"), $.identifier)),
      "(",
      field("object", $._expression),
      ",",
      field("property", $._expression),
      ")",
      "=",
      field("value", $._expression),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __value_assignment_frame_value: ($) =>
    seq(
      field("type", alias(kw("FRAME-VALUE"), $.identifier)),
      "=",
      field("value", $._expression),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __value_assignment_entry: ($) =>
    seq(
      field("type", alias(kw("ENTRY"), $.identifier)),
      "(",
      field("element", $._expression),
      ",",
      field("list", $._expression),
      optional(seq(",", field("delimiter", $._expression))),
      ")",
      "=",
      field("value", $._expression),
    ),

  __value_assignment_length: ($) =>
    seq(
      field("type", alias(kw("LENGTH"), $.identifier)),
      "(",
      field("value", $._expression),
      ")",
      "=",
      field("length", $._expression),
    ),

  __value_assignment_raw: ($) =>
    seq(
      field("type", alias(kw("RAW"), $.identifier)),
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
    ),

  __value_assignment_substring: ($) =>
    seq(
      field("type", alias(kw("SUBSTRING"), $.identifier)),
      "(",
      field("string", $._expression),
      ",",
      field("position", $._expression),
      optional(seq(",", field("length", $._expression))),
      ")",
      "=",
      field("value", $._expression),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),
});
