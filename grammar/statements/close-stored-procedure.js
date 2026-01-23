module.exports = ({ kw, tkw }) => ({
  close_stored_procedure_statement: ($) =>
    seq(
      tkw("CLOSE"),
      kw("STORED-PROCEDURE"),
      field("procedure", $._expression),
      optional(
        seq(
          field("status_var", $._expression),
          "=",
          tkw("PROC-STATUS"),
        ),
      ),
      optional(
        seq(
          kw("WHERE"),
          kw("PROC-HANDLE"),
          "=",
          field("handle", $._expression),
        ),
      ),
      $._terminator,
    ),
});
