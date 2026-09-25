export default ({ kw }) => ({
  run_stored_procedure_statement: ($) =>
    seq(kw("RUN"), $.__run_stored_procedure_body, $._terminator),

  __run_stored_procedure_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("STORED-PROCEDURE"),
      field("procedure", $._identifier_or_string_literal),
      optional($.__run_stored_procedure_result_no_error),
      optional(alias($.__run_stored_procedure_params, $.parameter_list)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __run_stored_procedure_result_no_error: ($) =>
    choice(
      seq(
        $.__run_stored_procedure_result,
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        optional(alias(kw("NO-ERROR"), $.no_error)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-ERROR"), $.no_error),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __run_stored_procedure_result: ($) =>
    choice(
      seq(
        kw("LOAD-RESULT-INTO"),
        field("result_handle", $._identifier_or_qualified_name),
        optional($._status),
      ),
      seq(field("handle_var", $._identifier_or_qualified_name), "=", kw("PROC-HANDLE")),
    ),

  __run_stored_procedure_params: ($) => seq($.__run_stored_procedure_params_prefix, ")"),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-optional-sequence, tree-sitter-optimize/single-use-sequence
  __run_stored_procedure_params_prefix: ($) =>
    seq(
      "(",
      // oxlint-disable-next-line tree-sitter-optimize/optional-list-head-extraction
      optional(seq($.__run_stored_procedure_param, optional($.__run_stored_procedure_param_tail))),
    ),

  __run_stored_procedure_param_tail: ($) =>
    seq(",", $.__run_stored_procedure_param, optional($.__run_stored_procedure_param_tail)),

  __run_stored_procedure_param: ($) =>
    seq(
      optional(field("direction", $._parameter_direction)),
      optional(seq(kw("PARAM"), field("name", $.identifier), "=")),
      field("value", $._expression),
    ),
});
