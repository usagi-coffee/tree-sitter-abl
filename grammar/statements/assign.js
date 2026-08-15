export default ({ kw }) => ({
  assign_statement: ($) => seq($.__assign_statement_prefix, $._no_error_terminator),

  // The list is optional. Generated code emits `ASSIGN` and a terminator with
  // nothing between when the assignments it was going to write all came from
  // macros that expanded to nothing; real code does this, and the bytes really
  // are just those two tokens.
  __assign_statement_prefix: ($) =>
    seq(
      kw("ASSIGN"),
      optional(
        choice(
          alias($.__assign_statement_phrase_body, $.assign_phrase),
          $.__assign_record_body,
          $.__assign_input_body,
        ),
      ),
    ),

  __assign_statement_phrase_body: ($) =>
    seq(
      choice($.__assign_pair_item, $.if_preprocessor_directive),
      repeat(choice($.__assign_pair_item, $.if_preprocessor_directive_statement)),
    ),
  __assign_pair_item: ($) => alias($.__assign_pair, $.assign_pair),

  __assign_record_body: ($) =>
    seq(
      field("record", $.__assign_record_name),
      optional(
        seq(
          kw("EXCEPT"),
          field("field", $._identifier_or_qualified_name),
          repeat(seq(optional(","), field("field", $._identifier_or_qualified_name))),
        ),
      ),
    ),

  __assign_input_body: ($) =>
    seq(
      optional(kw("INPUT")),
      choice(
        seq(kw("FRAME"), field("frame", $.__assign_widget_name)),
        seq(kw("BROWSE"), field("browse", $.__assign_widget_name)),
      ),
      repeat1(
        seq(
          field("field", $._assignable),
          optional(seq("=", field("value", $._expression))),
          optional($._when_phrase),
        ),
      ),
    ),

  __assign_record_name: ($) => $._identifier_or_qualified_name,
});
