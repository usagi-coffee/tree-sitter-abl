module.exports = ({ kw }) => ({
  value_assignment_statement: ($) =>
    seq(
      choice(
        $.__value_assignments_current_language,
        $.__value_assignments_current_value_family,
        $.__value_assignments_dynamic_property,
        $.__value_assignments_frame_value,
        $.__value_assignments_entry,
        $.__value_assignments_length,
        $.__value_assignments_raw,
        $.__value_assignments_substring,
      ),
      $._terminator,
    ),

  __value_assignments_current_language: ($) =>
    seq(
      field("type", alias(kw("CURRENT-LANGUAGE"), $.identifier)),
      $.__value_assignments_equals_value,
    ),

  __value_assignments_current_value_family: ($) =>
    seq(
      field(
        "type",
        choice(
          alias(kw("CURRENT-VALUE"), $.identifier),
          alias(kw("DYNAMIC-CURRENT-VALUE"), $.identifier),
        ),
      ),
      $.__value_assignments_current_body,
    ),
  __value_assignments_current_body: ($) =>
    seq(
      "(",
      field("sequence", $._expression),
      optional($.__value_assignments_database_tenant),
      ")",
      $.__value_assignments_equals_value,
    ),

  __value_assignments_dynamic_property: ($) =>
    seq(
      field("type", alias(kw("DYNAMIC-PROPERTY"), $.identifier)),
      "(",
      field("object", $._expression),
      ",",
      field("property", $._expression),
      ")",
      $.__value_assignments_value_no_error,
    ),

  __value_assignments_frame_value: ($) =>
    seq(
      field("type", alias(kw("FRAME-VALUE"), $.identifier)),
      $.__value_assignments_value_no_error,
    ),

  __value_assignments_entry: ($) =>
    seq(
      field("type", alias(kw("ENTRY"), $.identifier)),
      "(",
      field("element", $._expression),
      ",",
      field("list", $._expression),
      optional(seq(",", field("delimiter", $._expression))),
      $.__value_assignments_close_equals_value,
    ),

  __value_assignments_length: ($) =>
    seq(
      field("type", alias(kw("LENGTH"), $.identifier)),
      "(",
      field("value", $._expression),
      ")",
      "=",
      field("length", $._expression),
    ),

  __value_assignments_raw: ($) =>
    seq(
      field("type", alias(kw("RAW"), $.identifier)),
      "(",
      field("field", $._expression),
      optional(seq(",", $.__value_assignments_position_length)),
      $.__value_assignments_close_equals_value,
    ),

  __value_assignments_substring: ($) =>
    seq(
      field("type", alias(kw("SUBSTRING"), $.identifier)),
      "(",
      field("string", $._expression),
      ",",
      $.__value_assignments_position_length,
      ")",
      $.__value_assignments_value_no_error,
    ),
  __value_assignments_position_length: ($) =>
    seq(field("position", $._expression), optional(seq(",", field("length", $._expression)))),
  __value_assignments_database_tenant: ($) =>
    seq(",", field("database", $._expression), optional(seq(",", field("tenant", $._expression)))),
  __value_assignments_close_equals_value: ($) => seq(")", $.__value_assignments_equals_value),
  __value_assignments_equals_value: ($) => seq("=", field("value", $._expression)),
  __value_assignments_value_no_error: ($) =>
    seq($.__value_assignments_equals_value, optional(alias(kw("NO-ERROR"), $.no_error))),
});
