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

  // The syntax box closes the whole qualifier-and-fields group with `} ...`, so
  // it repeats: `ASSIGN INPUT BROWSE br t.f INPUT BROWSE br t.g.` compiles, and
  // only one group was read.
  //
  // A repeated group on its own does not generate. FRAME and BROWSE are
  // unreserved, so after a field list either of them is both a possible next
  // field and the opening of the next group, and nothing separates the two.
  // Requiring INPUT to open a continuation settles it -- INPUT is lexed as the
  // keyword, never as a field name -- and it is how the form is written.
  __assign_input_body: ($) =>
    seq(
      optional(kw("INPUT")),
      $.__assign_input_qualifier,
      $.__assign_input_fields,
      repeat(seq(kw("INPUT"), $.__assign_input_qualifier, $.__assign_input_fields)),
    ),
  __assign_input_qualifier: ($) =>
    choice(
      seq(kw("FRAME", { offset: 4 }), field("frame", $.__assign_widget_name)),
      seq(kw("BROWSE"), field("browse", $.__assign_widget_name)),
    ),
  __assign_input_fields: ($) =>
    repeat1(
      seq(
        field("field", $._assignable),
        optional(seq("=", field("value", $._expression))),
        optional($._when_phrase),
      ),
    ),

  __assign_record_name: ($) => $._identifier_or_qualified_name,
});
