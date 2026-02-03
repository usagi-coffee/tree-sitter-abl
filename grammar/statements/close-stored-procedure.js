module.exports = ({ kw }) => ({
  close_stored_procedure_statement: ($) =>
    seq(kw("CLOSE"), $.__close_stored_procedure_body, $._terminator),

  __close_stored_procedure_body: ($) =>
    seq(
      choice(kw("STORED-PROCEDURE"), kw("STORED-PROC")),
      field("procedure", $.__close_stored_procedure_target),
      optional(
        seq(
          field("status_var", $.__close_stored_procedure_target),
          "=",
          kw("PROC-STATUS"),
        ),
      ),
      optional(
        seq(
          kw("WHERE"),
          kw("PROC-HANDLE"),
          "=",
          field("handle", $.__close_stored_procedure_target),
        ),
      ),
    ),

  __close_stored_procedure_target: ($) => $._identifier_or_qualified_name,
});
