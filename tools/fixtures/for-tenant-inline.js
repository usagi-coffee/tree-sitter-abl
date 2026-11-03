export default grammar({
  rules: {
    _for_tenant: ($) => seq($._kw_for, kw("TENANT"), field("tenant", $._expression)),
    __create_record: ($) =>
      seq(
        field("table", choice($._qualified_identifier, $.preprocessor_name)),
        optional($._for_tenant),
        optional(
          seq(
            $._kw_using,
            choice(
              seq($._kw_rowid, $.__create_record_locator_rowid),
              seq($._kw_recid, $.__create_record_locator_recid),
            ),
          ),
        ),
      ),
    __reposition_tenant_no_error_tail: ($) =>
      choice(seq($._for_tenant, optional($.__no_error)), $.__no_error),
  },
});
