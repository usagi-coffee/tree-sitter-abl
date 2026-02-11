module.exports = ({ kw }) => ({
  subscribe_statement: ($) =>
    seq(kw("SUBSCRIBE"), $.__subscribe_body, $._terminator),

  __subscribe_body: ($) =>
    seq(
      optional(
        seq(
          kw("PROCEDURE", { offset: 4 }),
          field("subscriber", $.__subscribe_expression),
        ),
      ),
      optional(kw("TO")),
      field("event", $.__subscribe_expression),
      choice(alias($.__subscribe_in_phrase, $.in_phrase), alias(kw("ANYWHERE"), $.anywhere)),
      optional(alias($.__subscribe_run_procedure_phrase, $.run_procedure_phrase)),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),
  __subscribe_in_phrase: ($) =>
    seq(kw("IN"), field("publisher", $.__subscribe_expression)),
  __subscribe_run_procedure_phrase: ($) =>
    seq(kw("RUN-PROCEDURE"), field("procedure", $.__subscribe_expression)),
  __subscribe_expression: ($) =>
    choice(
      $.string_literal,
      $._identifier_or_qualified_name,
      $.object_access,
      $.function_call,
    ),
});
