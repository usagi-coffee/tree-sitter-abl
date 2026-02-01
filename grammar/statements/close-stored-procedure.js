module.exports = ({ kw }) => ({
  close_stored_procedure_statement: ($) =>
    seq(
      kw("CLOSE"),
      choice(kw("STORED-PROCEDURE"), kw("STORED-PROC")),
      $.__close_stored_procedure_body,
      $._terminator,
    ),

  __close_stored_procedure_body: ($) =>
    seq(
      field("procedure", $._expression),
      optional(seq(field("status_var", $._expression), "=", kw("PROC-STATUS"))),
      optional(
        seq(
          kw("WHERE"),
          kw("PROC-HANDLE"),
          "=",
          field("handle", $._expression),
        ),
      ),
    ),
});
