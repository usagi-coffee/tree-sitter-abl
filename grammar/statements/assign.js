module.exports = ({ kw }) => ({
  assign_statement: ($) =>
    seq(
      kw("ASSIGN"),
      choice(
        alias($.__assign_body, $.assign_phrase),
        $.__assign_record_body,
        $.__assign_input_body,
      ),
      $._terminator,
    ),

  __assign_record_body: ($) =>
    seq(
      field("record", $.__assign_record_name),
      optional(
        seq(
          kw("EXCEPT"),
          field("field", $._identifier_or_qualified_name),
          repeat(
            seq(optional(","), field("field", $._identifier_or_qualified_name)),
          ),
        ),
      ),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __assign_input_body: ($) =>
    seq(
      optional(kw("INPUT")),
      choice(
        seq(kw("FRAME"), field("frame", $.identifier)),
        seq(kw("BROWSE"), field("browse", $.identifier)),
      ),
      repeat1($.__assign_input_item),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __assign_input_item: ($) =>
    seq(
      field("field", $._assignable),
      optional(seq("=", field("value", $._expression))),
      optional(seq(kw("WHEN"), field("when", $._expression))),
    ),

  __assign_when_available_phrase: ($) =>
    seq(kw("WHEN"), kw("AVAILABLE"), $.__assign_record_name),

  __assign_record_name: ($) => $._identifier_or_qualified_name,
});
