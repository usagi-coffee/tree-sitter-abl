export default ({ kw }) => ({
  trigger_procedure_statement: ($) => seq($.__trigger_procedure_prefix, $._terminator),

  __trigger_procedure_prefix: ($) =>
    seq(
      kw("TRIGGER"),
      kw("PROCEDURE", { offset: 4 }),
      $._for_keyword,
      choice(
        // Simple events: CREATE, DELETE, FIND, REPLICATION-CREATE, etc.
        seq(field("event", $.identifier), $._of_keyword, field("object", $.identifier)),
        // WRITE event with optional NEW and OLD buffers
        seq(
          kw("WRITE"),
          $._of_keyword,
          field("object", $.identifier),
          optional($.__trigger_procedure_new_buffer),
          optional($.__trigger_procedure_old_buffer),
        ),
        // ASSIGN event
        seq(
          kw("ASSIGN"),
          choice(
            seq($._of_keyword, field("object", $.qualified_name)),
            seq(
              seq($._new_keyword, $.__trigger_procedure_value_body),
              optional(seq(kw("OLD"), $.__trigger_procedure_value_body)),
            ),
          ),
        ),
      ),
    ),

  __trigger_procedure_new_buffer: ($) =>
    seq($._new_keyword, optional(kw("BUFFER")), field("new_buffer", $.identifier)),

  __trigger_procedure_old_buffer: ($) =>
    seq(kw("OLD"), optional(kw("BUFFER")), field("old_buffer", $.identifier)),

  __trigger_procedure_value_body: ($) =>
    seq(
      optional(kw("VALUE")),
      field("value", $.identifier),
      choice(
        seq($._as_keyword, field("data_type", $.identifier)),
        seq($._like_keyword, field("like_field", $.qualified_name)),
      ),
      optional($.__trigger_procedure_options),
    ),
  __trigger_procedure_options: ($) =>
    prec.right(seq($.__trigger_procedure_option, optional($.__trigger_procedure_options))),
  __trigger_procedure_option: ($) =>
    choice(
      seq(kw("COLUMN-LABEL"), field("label", $.string_literal)),
      $._format_string,
      seq(kw("INITIAL"), field("initial", $._expression)),
      $._aggregate_label_phrase,
      alias($._no_undo_keyword, $.no_undo),
    ),
});
