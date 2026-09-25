export default ({ kw }) => ({
  trigger_procedure_statement: ($) => seq($.__trigger_procedure_prefix, $._terminator),

  __trigger_procedure_prefix: ($) =>
    seq(
      kw("TRIGGER"),
      $._kw_procedure,
      $._kw_for,
      choice(
        // Simple events: CREATE, DELETE, FIND, REPLICATION-CREATE, etc.
        seq(field("event", $.identifier), $._of_keyword, field("object", $.identifier)),
        // WRITE event with optional NEW and OLD buffers
        // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
        seq(
          $._kw_write,
          $._of_keyword,
          field("object", $.identifier),
          optional(seq($._new_keyword, optional($._kw_buffer), field("new_buffer", $.identifier))),
          optional($.__trigger_procedure_old_buffer),
        ),
        // ASSIGN event
        seq(
          $._kw_assign,
          choice(
            seq($._of_keyword, field("object", $.qualified_name)),
            seq(
              seq($._new_keyword, $.__trigger_procedure_value_body),
              optional(seq($._kw_old, $.__trigger_procedure_value_body)),
            ),
          ),
        ),
      ),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence, tree-sitter-optimize/single-use-sequence
  __trigger_procedure_old_buffer: ($) =>
    seq($._kw_old, optional($._kw_buffer), field("old_buffer", $.identifier)),

  __trigger_procedure_value_body: ($) =>
    seq(
      optional($._kw_value),
      field("value", $.identifier),
      choice(
        seq($._kw_as, field("data_type", $.identifier)),
        seq($._like_keyword, field("like_field", $.qualified_name)),
      ),
      optional($.__trigger_procedure_options),
    ),
  __trigger_procedure_options: ($) =>
    prec.right(seq($.__trigger_procedure_option, optional($.__trigger_procedure_options))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __trigger_procedure_option: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner -- this occurrence is part of a distinct trigger option sequence
      seq(kw("COLUMN-LABEL"), field("label", $.string_literal)),
      $._format_string,
      seq(kw("INITIAL"), field("initial", $._expression)),
      $._aggregate_label_phrase,
      alias($._kw_no_undo, $.no_undo),
    ),
});
