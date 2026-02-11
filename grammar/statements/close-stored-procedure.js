module.exports = ({ kw }) => ({
  close_stored_procedure_statement: ($) =>
    seq(kw("CLOSE"), $.__close_stored_procedure_body, $._terminator),

  __close_stored_procedure_body: ($) =>
    seq(
      choice(kw("STORED-PROCEDURE"), kw("STORED-PROC")),
      field("procedure", $._identifier_or_qualified_name),
      optional(
        seq(
          field("status_var", $._identifier_or_qualified_name),
          "=",
          kw("PROC-STATUS"),
        ),
      ),
      optional(
        seq(
          kw("WHERE"),
          kw("PROC-HANDLE"),
          "=",
          field("handle", $._identifier_or_qualified_name),
        ),
      ),
    ),
});
