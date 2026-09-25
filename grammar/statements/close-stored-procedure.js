export default ({ kw }) => ({
  close_stored_procedure_statement: ($) =>
    seq($._kw_close, $.__close_stored_procedure_body, $._terminator),

  __close_stored_procedure_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      choice($._kw_stored_procedure, kw("STORED-PROC")),
      field("procedure", $._qualified_identifier),
      optional($._status),
      optional(
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        seq($._kw_where, kw("PROC-HANDLE"), "=", field("handle", $._qualified_identifier)),
      ),
    ),
});
