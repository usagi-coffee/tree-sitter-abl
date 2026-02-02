module.exports = ({ kw }) => ({
  run_stored_procedure_statement: ($) =>
    seq(kw("RUN"), $.__run_stored_procedure_body, $._terminator),

  __run_stored_procedure_body: ($) =>
    seq(
      kw("STORED-PROCEDURE"),
      field("procedure", choice($.identifier, $.string_literal)),
      optional(
        choice(
          seq(
            kw("LOAD-RESULT-INTO"),
            field("result_handle", $._expression),
            optional(
              seq(field("status_var", $._expression), "=", kw("PROC-STATUS")),
            ),
          ),
          seq(field("handle_var", $._expression), "=", kw("PROC-HANDLE")),
        ),
      ),
      optional(kw("NO-ERROR")),
      optional(alias($.__run_stored_procedure_params, $.parameter_list)),
    ),

  __run_stored_procedure_params: ($) =>
    seq("(", optional($.__run_stored_procedure_param_list), ")"),

  __run_stored_procedure_param_list: ($) =>
    seq(
      $.__run_stored_procedure_param,
      repeat(seq(",", $.__run_stored_procedure_param)),
    ),

  __run_stored_procedure_param: ($) =>
    seq(
      optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
      optional(seq(kw("PARAM"), field("name", $.identifier), "=")),
      field("value", $._expression),
    ),
});
