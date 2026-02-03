module.exports = ({ kw }) => ({
  trigger_procedure_statement: ($) =>
    seq(
      kw("TRIGGER"),
      kw("PROCEDURE", { offset: 4 }),
      $.__trigger_procedure_body,
      $._terminator,
    ),

  __trigger_procedure_body: ($) =>
    seq(
      kw("FOR"),
      choice(
        // Simple events: CREATE, DELETE, FIND, REPLICATION-CREATE, etc.
        seq(
          field("event", $.identifier),
          kw("OF"),
          field("object", $.identifier),
        ),
        // WRITE event with optional NEW and OLD buffers
        seq(
          kw("WRITE"),
          kw("OF"),
          field("object", $.identifier),
          optional(
            seq(
              kw("NEW"),
              optional(kw("BUFFER")),
              field("new_buffer", $.identifier),
            ),
          ),
          optional(
            seq(
              kw("OLD"),
              optional(kw("BUFFER")),
              field("old_buffer", $.identifier),
            ),
          ),
        ),
        // ASSIGN event
        seq(
          kw("ASSIGN"),
          choice(
            seq(kw("OF"), field("object", $.qualified_name)),
            seq(
              $.__trigger_procedure_new_value,
              optional($.__trigger_procedure_old_value),
            ),
          ),
        ),
      ),
    ),

  __trigger_procedure_new_value: ($) =>
    seq(
      kw("NEW"),
      optional(kw("VALUE")),
      field("value", $.identifier),
      choice(
        seq(kw("AS"), field("data_type", $.identifier)),
        seq(kw("LIKE"), field("like_field", $.qualified_name)),
      ),
      repeat($.__trigger_procedure_value_option),
    ),

  __trigger_procedure_old_value: ($) =>
    seq(
      kw("OLD"),
      optional(kw("VALUE")),
      field("value", $.identifier),
      choice(
        seq(kw("AS"), field("data_type", $.identifier)),
        seq(kw("LIKE"), field("like_field", $.qualified_name)),
      ),
      repeat($.__trigger_procedure_value_option),
    ),

  __trigger_procedure_value_option: ($) =>
    choice(
      seq(kw("COLUMN-LABEL"), field("label", $.string_literal)),
      seq(kw("FORMAT"), field("format", $.string_literal)),
      seq(kw("INITIAL"), field("initial", $._expression)),
      seq(kw("LABEL"), field("label", $.string_literal)),
      kw("NO-UNDO"),
    ),
});
