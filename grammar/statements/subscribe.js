export default ({ kw }) => ({
  subscribe_statement: ($) => seq($.__subscribe_prefix, $._no_error_terminator),

  __subscribe_prefix: ($) =>
    seq(
      kw("SUBSCRIBE"),
      optional(seq($._kw_procedure, field("subscriber", $._text_operand))),
      optional($._kw_to),
      field("event", $._text_operand),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      choice(alias($.__subscribe_in_phrase, $.in_phrase), alias(kw("ANYWHERE"), $.anywhere)),
      optional(alias($.__subscribe_run_procedure_phrase, $.run_procedure_phrase)),
    ),
  __subscribe_in_phrase: ($) => seq($._kw_in, field("publisher", $._text_operand)),
  __subscribe_run_procedure_phrase: ($) =>
    seq(kw("RUN-PROCEDURE"), field("procedure", $._text_operand)),
});
