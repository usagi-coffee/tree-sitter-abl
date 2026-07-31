export default ({ kw }) => ({
  value_assignment_statement: ($) => seq($.__value_assignments_body, $._terminator),

  __value_assignments_body: ($) =>
    choice(
      seq(
        choice(
          field("type", alias(kw("CURRENT-LANGUAGE"), $.identifier)),
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
        ),
        $.__value_assignments_equals_value,
      ),
      seq(
        choice(
          seq(
            field("type", alias(kw("DYNAMIC-PROPERTY"), $.identifier)),
            "(",
            field("object", $._expression),
            ",",
            field("property", $._expression),
            ")",
          ),
          field("type", alias(kw("FRAME-VALUE"), $.identifier)),
          seq(
            field("type", alias(kw("SUBSTRING"), $.identifier)),
            "(",
            field("string", $._expression),
            ",",
            $.__value_assignments_position_length,
            ")",
          ),
        ),
        $.__value_assignments_value_no_error,
      ),
      seq(
        choice(
          seq(
            field("type", alias(kw("ENTRY"), $.identifier)),
            "(",
            field("element", $._expression),
            ",",
            field("list", $._expression),
            optional(seq(",", field("delimiter", $._expression))),
          ),
          seq(
            field("type", alias(kw("RAW"), $.identifier)),
            "(",
            field("field", $._expression),
            optional(seq(",", $.__value_assignments_position_length)),
          ),
        ),
        $.__value_assignments_close_equals_value,
      ),
      $.__value_assignments_length,
    ),

  __value_assignments_current_body: ($) =>
    seq(
      "(",
      field("sequence", $._expression),
      optional($.__value_assignments_database_tenant),
      ")",
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

  __value_assignments_position_length: ($) =>
    seq(field("position", $._expression), optional(seq(",", field("length", $._expression)))),
  __value_assignments_database_tenant: ($) =>
    seq(",", field("database", $._expression), optional(seq(",", field("tenant", $._expression)))),
  __value_assignments_close_equals_value: ($) => seq(")", $.__value_assignments_equals_value),
  __value_assignments_equals_value: ($) => seq("=", field("value", $._expression)),
  __value_assignments_value_no_error: ($) =>
    seq($.__value_assignments_equals_value, optional($.__no_error)),
});
